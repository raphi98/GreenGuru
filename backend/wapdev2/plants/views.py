from os import O_WRONLY, name
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from . import models
from userapi.models import User
from django.http import Http404
from userapi.views import JPEGRenderer, PNGRenderer
from rest_framework.parsers import MultiPartParser, FormParser
from plants.tasks import schedule_temp_watering_update

class PlantAPIViewSet(viewsets.ViewSet):
    def list(self, request):
        # everything in a try block for unforseen errors
        try:
            # get query parameters
            queries = request.query_params

            # check for user query (?user=pk)
            if "user" in queries:
                user_pk = queries["user"]
                get_object_or_404(models.User, pk=user_pk)
            else:
                plants_all = models.Plant.objects.all()        

            plants = []
            for plant in plants_all:
                try:
                    plant.image.size
                    imagelink = f"http://localhost:8000/api/plants/{plant.pk}/image"
                except:
                    imagelink = ""
                plants.append({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing, "image": imagelink, "reminder": plant.reminder})
            return Response(plants)
        except Exception as e:
            if e._class_ == Http404:
                raise e
            else:
                raise ValidationError(f"You did something wrong that was unexpected: {e}")
    
    def create(self, request):
        try:
            payload = request.data
            location = payload.get("location")
            plant_type = payload.get("plant_type")
            watering = payload.get("watering")
            watering_cycle = watering
            fertilizing = payload.get("fertilizing")
            fertilizing_cycle = fertilizing
            reminder = False

            if "name" not in payload or not isinstance(payload["name"], str):
                raise ValidationError("Property 'name' not found or invalid: it must be a string")

            if not("owner" in payload) or (payload["owner"] == None):
                raise ValidationError("Property 'owner' not found or invalid: it must be an integer representing the User ID")
            
            # convert string to bool because reminder is sent as string from frontend
            if "reminder" in payload:
                remind = payload["reminder"]
                if remind == "True":
                    reminder = True
                elif remind == "False":
                    reminder = False
            
            owner_id = payload["owner"]
            owner = User.objects.get(pk=owner_id)

            

            # Create a Plant instance with provided details
            plant = models.Plant.objects.create(
                name=payload["name"],
                owner=owner,
                location=location,
                plant_type=plant_type,
                watering=watering,
                fertilizing=fertilizing,
                watering_cycle=watering_cycle,
                fertilizing_cycle=fertilizing_cycle,
                reminder=reminder
            )

            image_file = request.FILES.get("image")
            plant.image=image_file
            plant.save()

            return Response({"status": "Plant created successfully!", "plant_id": plant.pk}, status=201)

        except User.DoesNotExist:
            raise ValidationError(f"User with ID {owner_id} does not exist")
        except Exception as e:
            raise ValidationError(f"An unexpected error occurred: {e}")
            
    
    def update(self, request, pk):
        try:
            payload = request.data

            # get query parameters
            queries = request.query_params

            plant = get_object_or_404(models.Plant, pk=pk)

            # Extract existing plant details
            plant_pk = plant.pk
            name = plant.name
            owner_pk = plant.owner.pk
            location = plant.location
            plant_type = plant.plant_type
            watering = plant.watering
            watering_cycle = plant.watering_cycle
            fertilizing = plant.fertilizing
            fertilizing_cycle = plant.fertilizing_cycle
            reminder = plant.reminder

            # check if the plant was watered
            if "watered" in queries:
                watering = plant.watering_cycle
                print("plant watered")

            # check if the plant was fertilized
            if "fertilized" in queries:
                fertilizing = plant.fertilizing_cycle
                print("plant fertilized")

            # Cannot change the id/pk of a plant
            if "id" in payload and int(payload["id"]) != plant_pk:
                raise ValidationError("Cannot change the id/pk of a plant")

            # Checking for name
            if "name" in payload:
                name = payload["name"]

            # Cannot change the owner of a plant
            if "owner" in payload and payload["owner"] != owner_pk:
                raise ValidationError("Cannot change the owner of a plant")

            # Check if location is given
            if "location" in payload:
                location = payload["location"]

            # Check if plant_type is given
            if "plant_type" in payload:
                plant_type = payload["plant_type"]

            # Check if watering is given
            if "watering" in payload:
                watering_cycle = payload["watering"]
                watering = payload["watering"]

            # Check if fertilizing is given
            if "fertilizing" in payload:
                fertilizing = payload["fertilizing"]

            # Check if reminder is given
            # convert string to bool because reminder is sent as string from frontend
            if "reminder" in payload:
                remind = payload["reminder"]
                if remind == "True":
                    reminder = True
                elif remind == "False":
                    reminder = False

            # Update plant details
            models.Plant.objects.filter(pk=pk).update(
                name=name,
                location=location,
                plant_type=plant_type,
                watering = watering,
                watering_cycle=watering_cycle,
                fertilizing=fertilizing,
                fertilizing_cycle=fertilizing_cycle,
                reminder=reminder
            )

            # Update the image if provided
            image_file = request.FILES.get("image")
            imagelink = ""
            if image_file:
                plant = get_object_or_404(models.Plant, pk=pk)
                plant.image.delete()  # Delete old image if exists
                plant.image = image_file  # Assign the new image
                plant.save()
                imagelink = f"http://localhost:8000/api/plants/{pk}/image"

            # Get the updated plant details
            response = {
                "id": pk,
                "name": name,
                "owner": owner_pk,
                "location": location,
                "plant_type": plant_type,
                "watering": watering,
                "fertilizing": fertilizing,
                "image": imagelink,
                "reminder": reminder
            }

            return Response(response, status=200)

        except Exception as e:
            if e._class_ == ValidationError or e._class_ == Http404:
                raise e
            else:
                raise ValidationError(f"An unexpected error occurred: {e}")

    def retrieve(self, request, pk):
        plant = get_object_or_404(models.Plant, pk=pk)
        try:
            plant.image.size
            imagelink = f"http://localhost:8000/api/plants/{plant.pk}/image"
        except:
            imagelink = ""
        return Response({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing, "image": imagelink, "reminder": plant.reminder}, status=200)

    def destroy(self, request, pk):
        payload = request.data
        plant = get_object_or_404(models.Plant, pk=pk)
        models.Plant.objects.filter(pk=pk).delete()
        return Response(payload, status=204)


class PlantImageViewSet(viewsets.ViewSet):

    renderer_classes = [JPEGRenderer, PNGRenderer]
    parser_classes = [MultiPartParser, FormParser]

    def retrieve(self, request, pk):
        plant = get_object_or_404(models.Plant, pk=pk)
        try:
            # the "plant_image" is a reference to a file in the file system.
            # DRF requires us to return a link to an open file object (thus calling open):
            return Response(plant.image.open(), status=200)
        except Exception as e:
            raise Http404(f"The image does not exist: {e}")
            

    def create(self, request, pk):
        plant = get_object_or_404(models.Plant, pk=pk)
        if plant.image is not None:
            # delete old image
            plant.image.delete()
        plant.image = request.FILES.get("plant_image")
        plant.save()
        return Response({"status": "Image successfully uploaded."}, status=200)


class PlantReminderViewSet(viewsets.ViewSet):

    def list(self, request):
        schedule_temp_watering_update(schedule=0, repeat=60)
        response = {"purpose": "This endpoint has to be called once after the server is running, to start the email reminder"}
        return Response(response)