from rest_framework import serializers
from .models import Project
from ..tracks.serializers import TrackSerializer


# Define the ProjectSerializer class, which inherits from ModelSerializer
class ProjectSerializer(serializers.ModelSerializer):
    # Define the tracks field to be a nested representation of the TrackSerializer
    # The many=True option indicates that the relationship is a to-many relationship
    tracks = TrackSerializer(many=True, read_only=True)
    # This field represents the user who added the project
    added_by = serializers.SerializerMethodField()

    # Define the Meta class to specify the model and fields to be included in the serialized representation
    class Meta:
        # Specify the model to be used
        model = Project
        # Specify the fields to be included in the serialized representation
        fields = ("id", "name", "route", "tracks", "added_by")

    # Define a method to get the value of the added_by field
    def get_added_by(self, obj):
        # Return the user_name of the user who added the project, if it exists
        # If the project does not have an added_by user, return None
        return obj.added_by.user_name if obj.added_by else None
