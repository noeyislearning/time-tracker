# Generated by Django 4.2.7 on 2023-11-27 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_newuser_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='newuser',
            name='is_login',
            field=models.BooleanField(default=False),
        ),
    ]
