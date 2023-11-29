# Import necessary modules from Django
from django.contrib import admin
from .models import NewUser
from django.forms import Textarea

# Register the NewUser model with the admin site
@admin.register(NewUser)
class UserAdmin(admin.ModelAdmin):
    # Specify the fields to be displayed in the list view
    # Specify the ordering of the list view
    # Specify the fields to be searched in the search box
    # Specify the fields to be read-only
    list_display = ("user_name", "id", "email", "is_active", "is_staff", "is_superuser", "is_login")
    ordering = ("is_staff", "is_superuser", "is_active", "created_at")
    search_fields = ("user_name",)
    readonly_fields = ("created_at", "updated_at")

    # Specify the layout of the detail view
    fieldsets = (
        (None, {"fields": ("user_name", "email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "is_active")}),
        ("Personal", {"fields": ("first_name", "last_name")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    # Override the formfield for the user_name field
    formfield_overrides = {
        NewUser.user_name.field: {"widget": Textarea(attrs={"rows": 1, "cols": 40})},
    }

    # Specify the layout of the add view
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("user_name", "email", "password1", "password2", "is_staff", "is_superuser", "is_active")}
        ),
    )