# Generated by Django 4.1.2 on 2023-06-16 01:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mainapp", "0003_project"),
    ]

    operations = [
        migrations.AddField(
            model_name="company",
            name="display",
            field=models.BooleanField(default=True),
        ),
    ]