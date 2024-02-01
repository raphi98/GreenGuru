import json
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from userapi.models import User
from django.contrib.auth.models import Group

class ApiViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_view_list(self):
        # Test the endpoint of ApiView
        url = reverse('api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, list))

class UserViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')

    def test_user_view_set_list_authenticated(self):
        # Test the endpoint for an authenticated user
        url = reverse('api_users')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))

    def test_user_view_set_list_unauthenticated(self):
        # Test the endpoint for an unauthenticated user
        url = reverse('api_users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

    def test_user_view_set_create(self):
        # Test the create endpoint of UserViewSet
        url = reverse('api_users')
        payload = {'username': 'newuser', 'password1': 'newpassword', 'password2': 'newpassword', 'email': 'newuser@example.com'}
        response = self.client.post(url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 201)

class SecurityViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')

    def test_security_view_set_list_authenticated(self):
        # Test the list endpoint of SecurityViewSet for an authenticated user
        url = reverse('api_security', args=[self.user.pk])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('is_active' in response.data)

    def test_security_view_set_update_authenticated(self):
        # Test the update endpoint of SecurityViewSet for an authenticated user
        url = reverse('api_security', args=[self.user.pk])
        print(self.user.pk)
        self.client.force_authenticate(user=self.user)
        payload = {'password1': 'newpassword', 'password2': 'newpassword', 'is_active': False}
        response = self.client.put(url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_security_view_set_update_unauthenticated(self):
        # Test the update endpoint of SecurityViewSet for an unauthenticated user
        url = reverse('api_security', args=[self.user.pk])
        payload = {'password1': 'newpassword', 'password2': 'newpassword', 'is_active': False}
        response = self.client.put(url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 403)


class UserModelTest(TestCase):

    def setUp(self):
        # Create users for testing
        self.user1 = User.objects.create_user(username='user1', password='password1', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='password2', email='user2@example.com')

    def test_add_friend(self):
        # Test adding a friend to the user's friend list
        self.user1.add_friend(self.user2)
        self.assertIn(self.user2, self.user1.friends.all())
        self.assertIn(self.user1, self.user2.friends.all())

    def test_remove_friend(self):
        # Test removing a friend from the user's friend list
        self.user1.add_friend(self.user2)
        self.user1.remove_friend(self.user2)
        self.assertNotIn(self.user2, self.user1.friends.all())
        self.assertNotIn(self.user1, self.user2.friends.all())

    def test_str_method(self):
        # Test the __str__ method of the User model
        self.assertEqual(str(self.user1), 'user1')

    def test_default_score(self):
        # Test the default score value
        self.assertEqual(self.user1.score, 0)

    def test_custom_score(self):
        # Test setting a custom score value
        self.user1.score = 50
        self.assertEqual(self.user1.score, 50)
