from rest_framework import serializers
from .models import Project
from ..tracks.serializers import TrackSerializer

class ProjectSerializer(serializers.ModelSerializer):
    
    tracks = TrackSerializer(many=True, read_only=True)
    added_by = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("id", "name", "route", "tracks", "added_by")

    # Getting the username of the user who added the project
    def get_added_by(self, obj):
        return obj.added_by.user_name if obj.added_by else None
