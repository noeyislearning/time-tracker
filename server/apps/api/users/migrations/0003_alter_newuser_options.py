# Generated by Django 4.2.7 on 2023-11-27 02:31

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_newuser_created_at_newuser_updated_at"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="newuser",
            options={"verbose_name": "User", "verbose_name_plural": "Users"},
        ),
    ]
