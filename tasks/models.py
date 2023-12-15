# Create your models here.
from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'
    PRIORITY_CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default=LOW)


    def __str__(self):
        return self.title


class LogEvent(models.Model):
    type = models.CharField(max_length=255)
    data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'tasks'  # Replace with the name of your Django app
        db_table = 'logs'
