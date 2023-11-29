from rest_framework import serializers
from .models import Track
from ..projects.models import Project
from ..users.models import NewUser as User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id", "name")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("user_name")


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ("id", "title", "description", "project", "start_time", "end_time", "status", "added_by", "duration", "created_at", "updated_at")


class TrackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ("title", "description", "project", "start_time", "end_time", "status", "duration", "added_by",)

    def create(self, validated_data):
        # Logic to handle creation of Track instances
        
        # Assuming the authenticated user is creating the track
        added_by = self.context['request'].user

        track = Track.objects.create(
            **validated_data
        )
        return track


class TrackRetrieveSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()
    added_by = serializers.StringRelatedField()

    class Meta:
        model = Track
        fields = ("id", "title", "description", "project", "start_time", "end_time", "status", "added_by", "duration", "created_at", "updated_at")

