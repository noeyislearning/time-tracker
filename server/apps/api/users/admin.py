from django import forms
from django.contrib import admin
from .models import NewUser
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django.db import models

@admin.register(NewUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ("user_name", "id", "email", "is_active", "is_staff", "is_superuser", "is_login")
    ordering = ("is_staff", "is_superuser", "is_active", "created_at")
    search_fields = ("user_name",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("user_name", "email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "is_active")}),
        ("Personal", {"fields": ("first_name", "last_name")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    formfield_overrides = {
        NewUser.user_name.field: {"widget": Textarea(attrs={"rows": 1, "cols": 40})},
    }

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("user_name", "email", "password1", "password2", "is_staff", "is_superuser", "is_active")}
        ),
    )

