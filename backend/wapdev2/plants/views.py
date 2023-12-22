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
                plants.append({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing})
            return Response(plants)
        
        except Exception as e:
            if e.__class__ == Http404:
                raise e
            else:
                raise ValidationError(f"You did something wrong that was unexpected: {e}")
    
    def create(self, request):
        # everything in a try block for unforseen errors
        try:
            payload = request.data
            location = None
            plant_type = None
            watering = None
            fertilizing = None

            # checking for name
            if not("name" in payload) or not(type(payload["name"]) == str):
                raise ValidationError("Property 'name' not found: must contain name of the plant")

            # checking for user/owner
            if not("owner" in payload) or (payload["owner"] == None) or not(type(payload["owner"]) == int):
                raise ValidationError("Property 'owner' not found: owner must be the primary key of the user as integer")
            user_pk = payload["owner"]
            try:
                owner = User.objects.get(pk=user_pk)
            except:
                raise ValidationError(f"User with pk {user_pk} not in database")
        
            # check if location is given
            if "location" in payload and type(payload["location"]) == str:
                location = payload["location"]

            # check if plant_type is given
            if "plant_type" in payload and type(payload["plant_type"]) == str:
                plant_type = payload["plant_type"]
            
            # check if watering is given
            if "watering" in payload and type(payload["watering"]) == int:
                watering = payload["watering"]

            # check if fertilizing is given
            if "fertilizing" in payload and type(payload["fertilizing"]) == int:
                fertilizing = payload["fertilizing"]
 
            models.Plant.objects.create(name=payload["name"], owner=owner, location=location, plant_type=plant_type, watering=watering, fertilizing=fertilizing)

            return Response(payload, status=201)
    
        except Exception as e:
            if e.__class__ == ValidationError:
                raise e
            else:
                raise ValidationError(f"You did something wrong that was unexpected: {e}")
            
    
    def update(self, request, pk):
        # everything in a try block for unforseen errors
        try:
            payload = request.data

            plant = get_object_or_404(models.Plant, pk=pk)

            plant_pk = plant.pk
            name = plant.name
            owner_pk = plant.owner.pk
            location = plant.location
            plant_type = plant.plant_type
            watering = plant.watering
            fertilizing = plant.fertilizing

            # cannot change pk of plant
            if "id" in payload and payload["id"] != plant_pk:
                raise ValidationError("Cannot change the id/pk of a plant")


            # checking for name
            if not("name" in payload) or not(type(payload["name"]) == str):
                raise ValidationError("Property 'name' not found: must contain name of the plant")
            name = payload["name"]

            # cannot change owner of a plant
            if "owner" in payload and payload["owner"] != owner_pk:
                raise ValidationError("Cannot change the owner of a plant")
        
            # check if location is given
            if "location" in payload and type(payload["location"]) == str:
                location = payload["location"]

            # check if plant_type is given
            if "plant_type" in payload and type(payload["plant_type"]) == str:
                plant_type = payload["plant_type"]
            
            # check if watering is given
            if "watering" in payload and type(payload["watering"]) == int:
                watering = payload["watering"]

            # check if fertilizing is given
            if "fertilizing" in payload and type(payload["fertilizing"]) == int:
                fertilizing = payload["fertilizing"]

            models.Plant.objects.filter(pk=pk).update(name=name, location=location, plant_type=plant_type, watering=watering, fertilizing=fertilizing)
            updated = get_object_or_404(models.Plant,pk=pk)

            response = {"id": pk, "name": name, "owner": owner_pk, "location": location, "plant_type": plant_type, "watering": watering, "fertilizing": fertilizing}
            return Response(response, status=200)
        
        except Exception as e:
            if e.__class__ == ValidationError or e.__class__ == Http404:
                raise e
            else:
                raise ValidationError(f"You did something wrong that was unexpected: {e}")
        
    
    def retrieve(self, request, pk):
        plant = get_object_or_404(models.Plant, pk=pk)
        return Response({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing}, status=200)
    
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
        plant = get_object_or_404(User, pk=pk)
        if plant.image is not None:
            # delete old image
            plant.image.delete()
        plant.image = request.FILES.get("profile_image")
        plant.save()
        return Response({"status": "Image successfully uploaded."}, status=200)