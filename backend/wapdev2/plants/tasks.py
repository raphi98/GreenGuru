from background_task import background
from django.core.mail import send_mail
from .models import Plant
from . import models


@background()  # Schedule every 60 seconds
def schedule_temp_watering_update():
    print("Background task started.")
    plants = models.Plant.objects.all()

    for plant in plants:
        update_temp_watering_fertilizing(plant.pk)


def update_temp_watering_fertilizing(plant_id):
    plant = models.Plant.objects.get(pk=plant_id)

    print(f"plant: {plant_id}")
    if plant.watering_cycle is not None:
        if plant.watering is None:
            plant.watering = plant.watering_cycle
        else:
            plant.watering -= 1
        if plant.watering == 0:
            if plant.reminder is True:  # Check if reminder is True
                send_watering_reminder_email(plant.owner.email, plant.name)  # Send reminder email to plant owner
            plant.watering = plant.watering_cycle  # Reset temp_watering to the original value

    if plant.fertilizing_cycle is not None:
        if plant.fertilizing is None:
            plant.fertilizing = plant.fertilizing_cycle
        else:
            plant.fertilizing -= 1
        if plant.fertilizing == 0:
            if plant.reminder is True:  # Check if reminder is True
                send_fertilizing_reminder_email(plant.owner.email, plant.name)  # Send reminder email to plant owner
            plant.fertilizing = plant.fertilizing_cycle  # Reset temp_watering to the original value

        plant.save()


def send_watering_reminder_email(owner_email, plant_name):
    print(f"watering:  {owner_email}")
    subject = f'Zeit für einen Wasserschub für {plant_name}! 🌿💧 '
    body = f"Wie geht es deinen grünen Freunden? 🌱 Unsere Pflanzen-Sensoren haben uns flüstert, dass es mal wieder Zeit für eine kleine Wasserrunde ist! \nDeine Pflanze {plant_name} könnte bald eine kleine Erfrischung gebrauchen. Wie wär\'s mit einer gemütlichen Gießsession in den nächsten Tagen? Jede Pflanze hat ihre eigenen Vorlieben, also schau einfach nach, wie viel Liebe sie braucht.\nGrüne Grüße,\nDas GreenGuru Team"
    sender_email = 'greenguru@example.com'  # Replace with your sender email

    send_mail(
        subject,
        body,
        sender_email,
        [owner_email],
        fail_silently=True,
    )


def send_fertilizing_reminder_email(owner_email, plant_name):
    print(f"fertilizing:  {owner_email}")
    subject = f'Düngerparty angesagt für {plant_name}! 🌿🎉'
    body = f"wie geht's deinen grünen Mitbewohnern? 🌱 Hier kommt eine kleine Erinnerung: Es ist Zeit für die nächste Runde Dünger für {plant_name}! Deine Pflanzen können es kaum erwarten, wieder in den Genuss einer köstlichen Mahlzeit zu kommen.\nBereite dich darauf vor, deine Pflanzen mit einer extra Portion Liebe zu verwöhnen. Ein leckeres Düngermahl steht an! Vergiss nicht, die individuellen Vorlieben deiner grünen Freunde zu berücksichtigen.\nGrüne Grüße,\nDas GreenGuru Team"
    sender_email = 'greenguru@example.com'  # Replace with your sender email

    send_mail(
        subject,
        body,
        sender_email,
        [owner_email],
        fail_silently=True,
    )