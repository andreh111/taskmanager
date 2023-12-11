from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Task

@receiver(post_save, sender=Task)
def task_created(sender, instance, created, **kwargs):
    if created:
        send_mail(
            'Task Created',
            'A task has been created.',
            'from@example.com',
            [instance.assigned_to.email],
            fail_silently=False,
        )
