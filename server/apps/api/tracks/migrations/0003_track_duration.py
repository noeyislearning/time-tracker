# Generated by Django 4.2.7 on 2023-11-27 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracks', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='duration',
            field=models.DurationField(blank=True, null=True),
        ),
    ]