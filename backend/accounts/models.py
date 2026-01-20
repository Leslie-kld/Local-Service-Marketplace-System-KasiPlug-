from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is_provider = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True)
    town = models.CharField(max_length=100, blank=True)
    suburb = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username



