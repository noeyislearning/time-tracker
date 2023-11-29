import uuid
from django.db import models
from django.utils.text import slugify
from django.conf import settings


# Defining the Project model
class Project(models.Model):
    # Defining the fields of the Project model
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=False, unique=True)
    route = models.CharField(max_length=100, blank=True)

    # This field represents the user who added the project
    # If the user is deleted, all their projects will also be deleted (CASCADE)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="projects", on_delete=models.CASCADE
    )

    # This field is automatically set to the current date and time when the project is created (auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # This field is automatically updated to the current date and time whenever the project is saved (auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Override the save method to automatically set the route field
    def save(self, *args, **kwargs):
        # Check if the route field is not already set
        # This is to prevent overwriting the route field when the project is updated
        if not self.route:
            # Convert the name to a slug and set it as the route
            # The slugify function converts the name to lowercase and replaces spaces with hyphens
            self.route = slugify(self.name)
        super(Project, self).save(*args, **kwargs)

    # Override the __str__ method to return the name of the project
    # This is used when the project is represented as a string (for example, in the admin interface)
    def __str__(self):
        return self.name
