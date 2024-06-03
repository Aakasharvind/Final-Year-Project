import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    DEBUG = True
    MONGO_URI = os.getenv('DATABASE_URI')
