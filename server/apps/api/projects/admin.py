from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Project

# Set the header of the admin site
admin.site.site_header = "Time Tracker Admin"

# Register the Project model with the admin site
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):  
    
    # Defining the fields to be displayed in the admin list view
    # Defining the default sorting field
    # Defining the search friends to be searched in the search bar
    # Defining the readonly fields and cannot be edited
    list_display = ("name", "route", "id", "tracks_count_link", "tracks_started", "tracks_ended", "tracks_paused", "added_by")
    ordering = ("created_at",)
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")

    # Defining a method to create a link to the tracks associated with a project
    def tracks_count_link(self, obj):
        
         # Generating the URL for the tracks associated with a project
         # Return a formatted HTML string with the link
        tracks_url = reverse('admin:tracks_track_changelist') + f'?project__id__exact={obj.id}'
        return format_html('<a href="{}">{}</a>', tracks_url, obj.tracks.count())
    # Setting the column naame for the method in the list view
    tracks_count_link.short_description = "Tracks Count (Click to view)"


    # Deffining a method to count the number of tracks with a specific status (ST - Started)
    def tracks_started(self, obj):
        return obj.tracks.filter(status="ST").count()
    tracks_started.short_description = "Started Tracks"

    # Deffining a method to count the number of tracks with a specific status (EN - Ended)
    def tracks_ended(self, obj):
        return obj.tracks.filter(status="EN").count()
    tracks_ended.short_description = "Ended Tracks"

    # Deffining a method to count the number of tracks with a specific status (PA - Paused)
    def tracks_paused(self, obj):
        return obj.tracks.filter(status="PA").count()
    tracks_paused.short_description = "Paused Tracks"

    # Deffining a method to get the user name of the user who added the project
    def added_by(self, obj):
        return obj.added_by.user_name if obj.added_by else None
    added_by.short_description = "Added By asdsa"

