from django.db import models
from django.contrib.auth.models import AbstractUser

# Patient's models

class Patient(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username