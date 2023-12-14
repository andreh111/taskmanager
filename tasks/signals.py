from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_notification_email(user_email, task_id):
    # Logic to send email
    send_mail(
        'Task Notification',
        f'A task with ID {task_id} has been created/updated.',
        'from@example.com',
        [user_email],
        fail_silently=False,
    )
