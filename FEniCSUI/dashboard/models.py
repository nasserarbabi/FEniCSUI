from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class projects (models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # this will create a unique id for each project
    name = models.CharField(max_length=30,
                            help_text='Project name (do not use space)')
    description = models.CharField(max_length=200,
                            help_text='a short description of the project')

    def __str__(self):
        return self.name