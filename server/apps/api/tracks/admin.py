from django.contrib import admin
from .models import Track


# Register the Track model with the admin site
@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    # Define the fields to be displayed in the admin interface
    # Define the default sorting field
    # Define the fields to be searched in the search bar
    # Define the fields that are read-only and cannot be edited
    list_display = (
        "title",
        "project_name",
        "id",
        "start_time",
        "end_time",
        "duration",
        "status",
        "added_by",
    )
    ordering = ("created_at",)
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")

    # Define a method to display the name of the project associated with a track
    def project_name(self, obj):
        # Return the name of the project if it exists, otherwise return None
        return obj.project.name if obj.project else None

    # Set the column name for the method in the list view
    project_name.short_description = "Project Name"
