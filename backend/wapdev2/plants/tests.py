from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from userapi.models import User
from .models import Plant


class PlantAPITestCase(TestCase):
    def setUp(self):
        # Creating a test user and a test plant for use in the tests
        self.user = User.objects.create(username='testuser', email='test@example.com', password='password')
        self.plant = Plant.objects.create(name='Test Plant', owner=self.user, location='Test Location', plant_type='Test Type', watering=7, fertilizing=14, watering_cycle=7, fertilizing_cycle=14, reminder=False)

    # Testing the successful retrieval of a list of plants
    def test_list_plants(self):
        url = reverse('plants_api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Testing the successful retrieval of detailed information for a specific plant
    def test_retrieve_plant_detail(self):
        url = reverse('plants_api', args=[self.plant.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Testing the successful creation of a new plant
    def test_create_plant(self):
        url = reverse('plants_api')
        data = {'name': 'New Plant', 'owner': self.user.pk, 'location': 'New Location', 'plant_type': 'New Type', 'watering': 7, 'fertilizing': 14, 'reminder': False}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Testing the successful update of an existing plant
    def test_update_plant(self):
        url = reverse('plants_api', args=[self.plant.pk])
        data = {'name': 'Updated Plant', 'location': 'Updated Location', 'plant_type': 'Updated Type', 'watering': 10, 'fertilizing': 21, 'reminder': True}
        response = self.client.put(url, data, content_type='application/json')  # Set the content type explicitly
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if the plant details are updated in the database
        updated_plant = Plant.objects.get(pk=self.plant.pk)
        self.assertEqual(updated_plant.name, 'Updated Plant')
        self.assertEqual(updated_plant.location, 'Updated Location')
        self.assertEqual(updated_plant.plant_type, 'Updated Type')
        self.assertEqual(updated_plant.watering, 10)
        self.assertEqual(updated_plant.fertilizing, 21)
        self.assertTrue(updated_plant.reminder)

    # Testing the successful deletion of an existing plant
    def test_delete_plant(self):
        url = reverse('plants_api', args=[self.plant.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Check if the plant is deleted from the database
        with self.assertRaises(Plant.DoesNotExist):
            deleted_plant = Plant.objects.get(pk=self.plant.pk)

    # Testing the functionality of starting plant reminders
    def test_start_reminder(self):
        url = reverse('plants_reminder')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)




class PlantModelTestCase(TestCase):
    def setUp(self):
        # Creating a test user
        self.user = User.objects.create(username='testuser', email='test@example.com', password='password')

        # Creating a test plant
        self.plant = Plant.objects.create(
            name='Test Plant',
            owner=self.user,
            location='Test Location',
            plant_type='Test Type',
            watering=7,
            fertilizing=14,
            watering_cycle=7,
            fertilizing_cycle=14,
            reminder=False
        )

    def test_plant_creation(self):
        # Check whether the plant has been created correctly
        self.assertEqual(self.plant.name, 'Test Plant')
        self.assertEqual(self.plant.owner, self.user)
        self.assertEqual(self.plant.location, 'Test Location')
        self.assertEqual(self.plant.plant_type, 'Test Type')
        self.assertEqual(self.plant.watering, 7)
        self.assertEqual(self.plant.fertilizing, 14)
        self.assertEqual(self.plant.watering_cycle, 7)
        self.assertEqual(self.plant.fertilizing_cycle, 14)
        self.assertFalse(self.plant.reminder)

    def test_image_upload(self):
        # Upload test image and check if it was uploaded successfully
        image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
        self.plant.image = image
        self.plant.save()

        # Check whether the image URL has been created correctly
        self.assertIn("uploads/plant_images/", self.plant.image.url)

    def test_reminder_default_value(self):
        # Check whether the default value for the reminder property is correct
        new_plant = Plant.objects.create(name='New Plant', owner=self.user)
        self.assertFalse(new_plant.reminder)

