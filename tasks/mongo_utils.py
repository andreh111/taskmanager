# mongo_utils.py
from datetime import datetime
from .models import LogEvent


def log_event(event_type, event_data):
    """ Log an event to the MongoDB database. """
    LogEvent.objects.using('mongodb').create(
        type=event_type,
        data=event_data,
        timestamp=datetime.now()
    )
