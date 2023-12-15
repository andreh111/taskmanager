# Generated by Django 4.1.13 on 2023-12-15 02:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0003_logevent"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="priority",
            field=models.CharField(
                choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")],
                default="Low",
                max_length=6,
            ),
        ),
        migrations.AlterField(
            model_name="logevent",
            name="data",
            field=models.JSONField(),
        ),
    ]
