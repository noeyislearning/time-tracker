import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from datetime import timedelta

# Choices
from .choices import TRACK_STATUS_CHOICES

class Track(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, blank=False, unique=False)
    description = models.TextField(max_length=255, blank=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)
    project = models.ForeignKey("projects.Project", related_name="tracks", on_delete=models.CASCADE)

    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="tracks", on_delete=models.CASCADE)

    status = models.CharField(max_length=20, choices=TRACK_STATUS_CHOICES, default="ST")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.project.name}"
    
    def save(self, *args, **kwargs):
        if self.status == 'ST' and not self.start_time:
            self.start_time = timezone.now()
        elif self.status == 'EN' and not self.end_time:
            self.end_time = timezone.now()
        elif self.status == 'PA':
            self.end_time = timezone.now()

        if self.start_time and not self.end_time:
            time_difference = timezone.now() - self.start_time
            # Calculate duration in seconds (excluding milliseconds)
            self.duration = time_difference - timezone.timedelta(microseconds=time_difference.microseconds)
        elif self.start_time and self.end_time:
            time_difference = self.end_time - self.start_time
            # Calculate duration in seconds (excluding milliseconds)
            self.duration = time_difference - timezone.timedelta(microseconds=time_difference.microseconds)

        super(Track, self).save(*args, **kwargs)


    def get_total_time(self):
        if self.is_ended:
            self.total_time = self.end_time - self.start_time
        return self.total_time
