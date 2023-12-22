from django.contrib import admin
from . import models


class PlantAdmin(admin.ModelAdmin): pass

admin.site.register(models.Plant, PlantAdmin)


