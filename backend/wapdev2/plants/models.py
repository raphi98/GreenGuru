from email.policy import default
from django.db import models
from userapi.models import User

def upload(instance, filename):
    # Put upload files under uploads/plant_images, whereas each 
    # user has its own directory (using the primary key)
    # The filename as provided by the upload is preserved
    return "uploads/plant_images/%s/%s" % (instance.pk,filename)

class Plant(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100, null=True, help_text="location of plant")
    plant_type = models.CharField(max_length=100, null=True, help_text="type of plant")
    watering = models.IntegerField(default=None, null=True, help_text="days until plant needs watering")
    fertilizing = models.IntegerField(default=None, null=True, help_text="fertilizing period in days")
    image = models.ImageField(upload_to=upload,blank=True,null=True)
    watering_cycle = models.IntegerField(default=None, null=True, help_text="watering period in days")
    reminder = models.BooleanField(default=False, help_text="email-reminder")
    def __str__(self):
        return self.name
