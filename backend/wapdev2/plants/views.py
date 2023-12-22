from os import O_WRONLY, name
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from django.http import HttpResponse
from . import models
from userapi.models import User

class PlantAPIViewSet(viewsets.ViewSet):
    
    def list(self, request):
        plants = []
        for plant in models.Plant.objects.all():
            plants.append({"id": plant.pk, "name": plant.name, "owner": plant.owner.pk, "location": plant.location, "plant_type": plant.plant_type, "watering": plant.watering, "fertilizing": plant.fertilizing})
        return Response(plants)
    
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
            else: raise ValidationError(f"You did something wrong that was unexpected: {e}")
            
    
    def update(self, request, plant_pk):
        raise NotImplementedError
    
    def retrieve(self, request, plant_pk):
        raise NotImplementedError
    
    def destroy(self, request, plant_pk):
        raise NotImplementedError
    

    
