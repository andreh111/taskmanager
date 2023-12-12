import logging
from pymongo import MongoClient


class MongoHandler(logging.Handler):
    def __init__(self, mongo_uri, database, collection, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = MongoClient(mongo_uri)
        self.db = self.client[database]
        self.collection = self.db[collection]

    def emit(self, record):
        log_entry = self.format(record)
        self.collection.insert_one({'log': log_entry})
