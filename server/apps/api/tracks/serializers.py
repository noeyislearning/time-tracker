from rest_framework import serializers

# Import the Track, Project, and User models from the current directory
from .models import Track
from ..projects.models import Project
from ..users.models import NewUser as User


# This serializer is used to serialize Project instances
class ProjectSerializer(serializers.ModelSerializer):

    # Specify the model to be used for this serializer
    # Specify the fields to be included in the serialized representation
    class Meta:
        model = Project
        fields = ("id", "name")


# This serializer is used to serialize User instances
class UserSerializer(serializers.ModelSerializer):

    # Specify the model to be used for this serializer
    # Specify the fields to be included in the serialized representation
    class Meta:
        model = User
        fields = ("user_name")


# This serializer is used to serialize Track instances
class TrackSerializer(serializers.ModelSerializer):

    # Specify the model to be used for this serializer
    # Specify the fields to be included in the serialized representation
    class Meta:
        model = Track
        fields = ("id", "title", "description", "project", "start_time", "end_time", "status", "added_by", "duration", "created_at", "updated_at")


# This serializer is used to serialize Track instances for creation
class TrackCreateSerializer(serializers.ModelSerializer):

    # Specify the model to be used for this serializer
    # Specify the fields to be included in the serialized representation
    class Meta:
        model = Track
        fields = ("title", "description", "project", "start_time", "end_time", "status", "duration", "added_by",)

    # Override the create method to handle the creation of Track instances
    def create(self, validated_data):

        # Get the authenticated user from the request
        added_by = self.context['request'].user
        # Create a new Track instance with the validated data and the authenticated user
        track = Track.objects.create(**validated_data)
        # Return the newly created Track instance
        return track


# This serializer is used to serialize Track instances for retrieval
class TrackRetrieveSerializer(serializers.ModelSerializer):

    # Use the ProjectSerializer to serialize the project field
    project = ProjectSerializer()
    # Use the StringRelatedField to serialize the added_by field
    added_by = serializers.StringRelatedField()

    class Meta:
        # Specify the model to be used for this serializer
        model = Track
        # Specify the fields to be included in the serialized representation
        fields = ("id", "title", "description", "project", "start_time", "end_time", "status", "added_by", "duration", "created_at", "updated_at")

