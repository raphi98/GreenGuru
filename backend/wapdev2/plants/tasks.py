from background_task import background
from django.core.mail import send_mail
from .models import Plant
from . import models


@background(schedule=60)  # Schedule every 60 seconds
def schedule_temp_watering_update():
    print("Background task started.")
    plants = models.Plant.objects.all()

    for plant in plants:
        update_temp_watering(plant.pk)


def update_temp_watering(plant_id):
    plant = models.Plant.objects.get(pk=plant_id)

    print(f"plant: {plant_id}")
    if plant.watering_cycle is not None:
        if plant.watering is None:
            plant.watering = plant.watering_cycle
        else:
            plant.watering -= 1
        if plant.watering == 0:
            if plant.reminder is True:  # Check if reminder is True
                send_reminder_email(plant.owner.email, plant.name)  # Send reminder email to plant owner
            plant.watering = plant.watering_cycle  # Reset temp_watering to the original value

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
        fail_silently=True,
    )




