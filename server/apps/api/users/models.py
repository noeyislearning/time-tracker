import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


# This manager is used to manage the creation of User instances
class CustomAccountManager(BaseUserManager):
  
    # Define a method to create a superuser
    def create_superuser(self, email, user_name, first_name, last_name, password, **other_fields):
    
        # Set default values for the is_staff, is_superuser, and is_active fields       
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        # Raise an error if the is_staff or is_superuser field is not True
        if other_fields.get("is_staff") is not True:
            raise ValueError(
                "Superuser must be assigned as a staff."
            )
        if other_fields.get("is_superuser") is not True:
            raise ValueError(
                "Superuser must be assigned as a superuser."
            )
        
        # Call the create_user method to create the superuser
        return self.create_user(email, user_name, first_name, last_name, password, **other_fields)
    
    # Define a method to create a user
    def create_user(self, email, user_name, first_name, last_name, password, **other_fields):

        # Raise an error if the email field is not provided
        if not email:
            raise ValueError(_("Email address must be provided."))
        
        # Normalize the email field
        # Create a new User instance with the provided fields
        # Set the password for the User instance
        # Save the User instance
        # Return the User instance
        email = self.normalize_email(email)
        user = self.model(email=email, user_name=user_name, first_name=first_name, last_name=last_name, **other_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
# Define the NewUser model, which inherits from AbstractBaseUser and PermissionsMixin
class NewUser(AbstractBaseUser, PermissionsMixin):

    # Define the fields for the NewUser model
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("email address"), unique=True)
    user_name = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_login = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Specify the manager for the NewUser model
    objects = CustomAccountManager()

    # Specify the field to be used as the username field
    USERNAME_FIELD = "email"
    # Specify the fields to be prompted for when creating a user using the createsuperuser command
    REQUIRED_FIELDS = ["user_name", "first_name", "last_name"]

    # Define the __str__ method to return the email field
    def __str__(self):
        return self.user_name + ", " + self.email

    # Change the name of the NewUser model in the admin interface from "NewUser" to "User"
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"