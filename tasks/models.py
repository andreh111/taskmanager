# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from djongo import models


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class LogEvent(models.Model):
    type = models.CharField(max_length=255)
    data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'tasks'  # Replace with the name of your Django app
        db_table = 'logs'
