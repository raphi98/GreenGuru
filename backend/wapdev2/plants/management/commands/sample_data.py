from django.core.management.base import BaseCommand
from userapi.models import User
from ... import models
from django.core.files import File
import os
from django.shortcuts import get_object_or_404


class Command(BaseCommand):
    help = 'Populate the database with example data'

    def handle(self, *args, **options):
        # Delete existing data
        self.stdout.write(self.style.SUCCESS('Deleting existing data...'))
        User.objects.all().delete()
        models.Plant.objects.all().delete()

        # Create example data
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))

        # Create admin user
        admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')

        # Create 3 users
        user1 = User.objects.create_user('Florian', 'user1@example.com', 'user')
        user2 = User.objects.create_user('Sebastian', 'user2@example.com', 'user')
        user3 = User.objects.create_user('Raphael', 'user3@example.com', 'user')

        # Create plants
        models.Plant.objects.create(name="Jürgen", owner=user1, location="Bedroom", plant_type="Tree", watering=20, fertilizing=None)
        models.Plant.objects.create(name="Spike", owner=user2, location="Living room", plant_type="Fern", watering=5, fertilizing=50)
        models.Plant.objects.create(name="Lily", owner=user2, location="Kitchen", plant_type="Succulent", watering=7, fertilizing=200)
        models.Plant.objects.create(name="Fern", owner=user3, location="Office", plant_type="Bonsai", watering=1, fertilizing=150)
        


        image_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'scripts'))
        img1 = os.path.join(image_folder, 'sanpedro.jpg')
        img2 = os.path.join(image_folder, 'orchid.jpg')
        img3 = os.path.join(image_folder, 'colorful-succulents.jpg')

        # Helper function to create plants with images
        def create_plant_with_image(name, owner, location, plant_type, watering, fertilizing, img_path):
            if os.path.exists(img_path):
                with open(img_path, 'rb') as img_file:
                    plant = models.Plant.objects.create(
                        name=name,
                        owner=owner,
                        location=location,
                        plant_type=plant_type,
                        watering=watering,
                        fertilizing=fertilizing,
                    )
                    # Assign the image to the Plant object
                    plant.image.save(os.path.basename(img_path), File(img_file))

        create_plant_with_image("San Pedro", user1, "Living room", "Cactus", None, None, img1)
        create_plant_with_image("Blossom", user3, "Garden", "Orchid", 2, 1, img2)
        create_plant_with_image("Prickles", user3, "Kitchen", "Succulent", 7, 200, img3)


        # adding profile pictures for users
        pfp1 = os.path.join(image_folder, 'avatar1.jpg')
        pfp2 = os.path.join(image_folder, 'avatar2.jfif')
        if os.path.exists(pfp1):
                with open(pfp1, 'rb') as img_file:
                    user = get_object_or_404(User, pk=1)
                    # Assign the image to the User object
                    user.profile_image.save(os.path.basename(pfp1), File(img_file))

        if os.path.exists(pfp2):
                with open(pfp2, 'rb') as img_file:
                    user = get_object_or_404(User, pk=1)
                    # Assign the image to the User object
                    user.profile_image.save(os.path.basename(pfp2), File(img_file))

        self.stdout.write(self.style.SUCCESS('Plants with images: ID 5, 6, 7 \nUser with images: ID 1, 2'))
        self.stdout.write(self.style.SUCCESS('Sample data with images created successfully.'))