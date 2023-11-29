import re
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from .models import NewUser as User


class RegisterUserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """

    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "user_name",
            "email",
            "password",
            "first_name",
            "last_name",
            "confirm_password",
        )

    def validate_user_name(self, value):
        """
        Validate the user_name field.
        """

        pattern = r"^[a-zA-Z0-9_]+$"
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Username should contain only letters, numbers, or underscores."
            )
        return value.lower()

    def validate_email(self, value):
        """
        Validate the email field.
        """

        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", value):
            raise serializers.ValidationError("Invalid email format.")
        return value.lower()

    # Define a method to validate the inputs
    def validate_inputs(self, data):
        """
        Validate user inputs.
        """

        user_name = data.get("user_name", None)
        email = data.get("email", None)
        password = data.get("password", None)
        confirm_password = data.get("confirm_password", None)

        if User.objects.filter(user_name__iexact=user_name).exists():
            raise serializers.ValidationError("Username already exists.")

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Email already exists.")

        if len(password) < 8:
            raise serializers.ValidationError(
                "Password should be at least 8 characters long."
            )

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    # Define a method to validate the data
    def validate(self, data):
        """
        Validate the entire set of data.
        """

        validated_data = super().validate(data)
        self.validate_inputs(validated_data)
        return validated_data

    # Define a method to create a User instance
    def create(self, validated_data):
        """
        Create a new User instance.
        """

        validated_data.pop("confirm_password")
        user_name = validated_data.get("user_name", None)
        email = validated_data.get("email", None)
        password = validated_data.get("password", None)
        first_name = validated_data.get("first_name", None)
        last_name = validated_data.get("last_name", None)

        if first_name and last_name and user_name and email:
            validated_data["user_name"] = self.validate_user_name(user_name)
            validated_data["email"] = self.validate_email(email)
            validated_data["first_name"] = first_name
            validated_data["last_name"] = last_name

        instance = self.Meta.model.objects.create_user(**validated_data)
        return instance


#  This serializer is used to serialize and deserialize User instances for login
class CustomAuthTokenSerializer(AuthTokenSerializer):
    """
    Serializer for user authentication.
    """

    # Define a method to validate the data
    def validate(self, attrs):
        """
        Validate user credentials for login.
        """

        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"), username=username, password=password
        )

        if user:
            token, created = Token.objects.get_or_create(user=user)
            user.is_login = True
            user.save()

            attrs["user"] = user
            return attrs

        raise serializers.ValidationError(
            "Unable to log in with provided credentials.")
