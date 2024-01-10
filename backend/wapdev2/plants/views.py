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
                plants_all = models.Plant.objects.filter(owner__pk=user_pk)
            else: 
                plants_all = models.Plant.objects.all()        

            plants = []
            for plant in plants_all:
                try:
                    plant.image.size
                    imagelink = f"http://localhost:8000/api/plants/{plant.pk}/image"
                except:
                    imagelink = ""
                plants.append({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing, "image": imagelink})
            return Response(plants)
        
        except Exception as e:
            if e.__class__ == Http404:
                raise e
            else:
                raise ValidationError(f"You did something wrong that was unexpected: {e}")
    
    def create(self, request):
        try:
            payload = request.data
            location = payload.get("location")
            plant_type = payload.get("plant_type")
            watering = payload.get("watering")
            fertilizing = payload.get("fertilizing")

            if "name" not in payload or not isinstance(payload["name"], str):
                raise ValidationError("Property 'name' not found or invalid: it must be a string")

            if not("owner" in payload) or (payload["owner"] == None):
                raise ValidationError("Property 'owner' not found or invalid: it must be an integer representing the User ID")
            
            owner_id = payload["owner"]
            owner = User.objects.get(pk=owner_id)

            image_file = request.FILES.get("image")

            # Create a Plant instance with provided details
            plant = models.Plant.objects.create(
                name=payload["name"],
                owner=owner,
                location=location,
                plant_type=plant_type,
                watering=watering,
                fertilizing=fertilizing,
                image=image_file  # Assign the image file directly to the image field
            )

            return Response({"status": "Plant created successfully!", "plant_id": plant.pk}, status=201)

        except User.DoesNotExist:
            raise ValidationError(f"User with ID {owner_id} does not exist")
        except Exception as e:
            raise ValidationError(f"An unexpected error occurred: {e}")
            
    
    def update(self, request, pk):
        try:
            payload = request.data

            plant = get_object_or_404(models.Plant, pk=pk)

            # Extract existing plant details
            plant_pk = plant.pk
            name = plant.name
            owner_pk = plant.owner.pk
            location = plant.location
            plant_type = plant.plant_type
            watering = plant.watering
            fertilizing = plant.fertilizing

            # Cannot change the id/pk of a plant
            if "id" in payload and int(payload["id"]) != plant_pk:
                raise ValidationError("Cannot change the id/pk of a plant")

            # Checking for name
            if not ("name" in payload):
                raise ValidationError("Property 'name' not found: must contain the name of the plant")
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
                watering = payload["watering"]

            # Check if fertilizing is given
            if "fertilizing" in payload:
                fertilizing = payload["fertilizing"]

            # Update plant details
            models.Plant.objects.filter(pk=pk).update(
                name=name,
                location=location,
                plant_type=plant_type,
                watering=watering,
                fertilizing=fertilizing
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
                "image": imagelink
            }

            return Response(response, status=200)

        except Exception as e:
            if e.__class__ == ValidationError or e.__class__ == Http404:
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
        return Response({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing, "image": imagelink}, status=200)
    
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