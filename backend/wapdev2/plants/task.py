from background_task import background
from django.core.mail import send_mail
from .models import Plant
from . import models


@background(schedule=5)  # Schedule every 60 seconds
def schedule_temp_watering_update():
    print("Background task started.")
    plants = models.Plant.objects.all()

    for plant in plants:
        update_temp_watering(plant.id)


def update_temp_watering(plant_id):
    plant = Plant.objects.get(id=plant_id)

    if plant.watering is not None:
        if plant.temp_watering is None:
            plant.temp_watering = plant.watering
        else:
            plant.temp_watering -= 1

        if plant.temp_watering == 0:
            if plant.reminder is True:  # Check if reminder is True
                send_reminder_email(plant.owner.email, plant.name)  # Send reminder email to plant owner
            plant.temp_watering = plant.watering  # Reset temp_watering to the original value

        plant.save()


def send_reminder_email(owner_email, plant_name):
    subject = f'Erinnerung: Gießen für {plant_name}'
    body = f'Bitte gießen Sie die Pflanze namens {plant_name}. Sie benötigt Wasser.'
    sender_email = 'greenguru@example.com'  # Replace with your sender email

    send_mail(
        subject,
        body,
        sender_email,
        [owner_email],
        fail_silently=False,
    )




