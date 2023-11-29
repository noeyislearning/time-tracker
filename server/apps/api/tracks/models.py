import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from datetime import timedelta

# Import the TRACK_STATUS_CHOICES from the current directory
from .choices import TRACK_STATUS_CHOICES


# Define the Track model
class Track(models.Model):
    # Define the id field as a UUID, with a default value of a new UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Define the title field as a CharField with a maximum length of 100 characters
    # This field cannot be blank
    title = models.CharField(max_length=100, blank=False, unique=False)
    description = models.TextField(max_length=255, blank=True)

    # Define the start_time and end_time fields as DateTimeFields
    # These fields can be blank and null
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)

    # Define the duration field as a DurationField
    # This field can be blank and null
    duration = models.DurationField(blank=True, null=True)

    # Define the project field as a ForeignKey to the Project model
    # This field represents the project that the track is associated with
    # If the project is deleted, all its tracks will also be deleted (CASCADE)
    project = models.ForeignKey(
        "projects.Project", related_name="tracks", on_delete=models.CASCADE
    )

    # Define the added_by field as a ForeignKey to the user model
    # This field represents the user who added the track
    # If the user is deleted, all their tracks will also be deleted (CASCADE)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="tracks", on_delete=models.CASCADE
    )

    # Define the status field as a CharField with a maximum length of 20 characters
    # This field cannot be blank and its value must be one of the choices defined in TRACK_STATUS_CHOICES
    # The default value is "ST"
    status = models.CharField(
        max_length=20, choices=TRACK_STATUS_CHOICES, default="ST")

    # Define the created_at and updated_at fields as DateTimeFields
    # The created_at field is automatically set to the current date and time when the track is created (auto_now_add=True)
    # The updated_at field is automatically updated to the current date and time whenever the track is saved (auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Override the __str__ method to return the title of the track and the name of the associated project
    def __str__(self):
        return f"{self.title} - {self.project.name}"

    # Override the save method to automatically set the start_time, end_time, and duration fields
    def save(self, *args, **kwargs):
        # If the status is 'ST' and the start_time is not set, set the start_time to the current date and time
        if self.status == "ST" and not self.start_time:
            self.start_time = timezone.now()
        # If the status is 'EN' and the end_time is not set, set the end_time to the current date and time
        elif self.status == "EN" and not self.end_time:
            self.end_time = timezone.now()
        # If the status is 'PA', set the end_time to the current date and time
        elif self.status == "PA":
            self.end_time = timezone.now()

        # If the start_time is set and the end_time is not set, calculate the duration
        if self.start_time and not self.end_time:
            time_difference = timezone.now() - self.start_time
            # Calculate duration in seconds (excluding milliseconds)
            self.duration = time_difference - timezone.timedelta(
                microseconds=time_difference.microseconds
            )
        # If both the start_time and end_time are set, calculate the duration
        elif self.start_time and self.end_time:
            time_difference = self.end_time - self.start_time
            # Calculate duration in seconds (excluding milliseconds)
            self.duration = time_difference - timezone.timedelta(
                microseconds=time_difference.microseconds
            )

        # Call the save method of the superclass (Model) to save the track
        super(Track, self).save(*args, **kwargs)

    # Define a method to get the total time of the track
    def get_total_time(self):
        # If the track has ended, calculate the total time
        if self.is_ended:
            self.total_time = self.end_time - self.start_time
        # Return the total time
        return self.total_time
