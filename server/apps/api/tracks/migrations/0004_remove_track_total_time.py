# Generated by Django 4.2.7 on 2023-11-27 02:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracks', '0003_track_duration'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='track',
            name='total_time',
        ),
    ]