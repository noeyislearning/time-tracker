from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Project

admin.site.site_header = "Time Tracker Admin"

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):  
    list_display = ("name", "route", "id", "tracks_count_link", "tracks_started", "tracks_ended", "tracks_paused", "added_by")
    ordering = ("created_at",)
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")

    # Make the "Tracks Count" column clickable and redirect to the tracks page for that project
    def tracks_count_link(self, obj):
        # Get the URL for the tracks page for this project
        tracks_url = reverse('admin:tracks_track_changelist') + f'?project__id__exact={obj.id}'
        return format_html('<a href="{}">{}</a>', tracks_url, obj.tracks.count())
    tracks_count_link.short_description = "Tracks Count (Click to view)"


    # Filter out all the tracks that is in "Started" status, "Ended" status, and "Paused" status and get the count for each status
    # Track status: ST = Started, EN = Ended, PA = Paused
    def tracks_started(self, obj):
        return obj.tracks.filter(status="ST").count()
    tracks_started.short_description = "Started Tracks"

    def tracks_ended(self, obj):
        return obj.tracks.filter(status="EN").count()
    tracks_ended.short_description = "Ended Tracks"

    def tracks_paused(self, obj):
        return obj.tracks.filter(status="PA").count()
    tracks_paused.short_description = "Paused Tracks"

    # Getting the username of the user who added the project
    def added_by(self, obj):
        return obj.added_by.user_name if obj.added_by else None
    added_by.short_description = "Added By asdsa"

