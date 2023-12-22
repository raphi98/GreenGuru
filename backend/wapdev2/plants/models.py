from email.policy import default
from django.db import models
from userapi.models import User


class Plant(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100, null=True, help_text="location of plant")
    plant_type = models.CharField(max_length=100, null=True, help_text="type of plant")
    watering = models.IntegerField(default=None, null=True, help_text="watering period in days")
    fertilizing = models.IntegerField(default=None, null=True, help_text="fertilizing period in days")

    def __str__(self):
        return self.name