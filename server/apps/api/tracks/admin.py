from django.contrib import admin
from .models import Track

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ("title", "project_name", "id", "start_time", "end_time", "duration", "status", "added_by")
    ordering = ("created_at",)
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")

    def project_name(self, obj):
        return obj.project.name if obj.project else None
    project_name.short_description = "Project Name"
