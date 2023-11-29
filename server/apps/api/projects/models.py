import uuid
from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=False, unique=True)
    route = models.CharField(max_length=100, blank=True)

    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="projects", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Check if route is not already set as a slug (for updates)
        if not self.route:
            # Convert name to lowercase and replace spaces with hyphens
            self.route = slugify(self.name)
        super(Project, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
