import re
from rest_framework import viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import authentication, permissions
from rest_framework.serializers import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.core.files.base import ContentFile
from rest_framework.parsers import JSONParser
from userapi.models import User
from . import serializers

from wapdev2 import urls

from rest_framework import renderers


class JPEGRenderer(renderers.BaseRenderer):
    media_type = 'image/jpeg'
    format = 'jpg'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


class PNGRenderer(renderers.BaseRenderer):
    media_type = 'image/png'
    format = 'png'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


class ApiView(viewsets.ViewSet):

    def list(self, request):
        endpoints = []
        for pattern in urls.urlpatterns:
            endpoint = str(pattern.pattern)
            # Include only api/ views and include only top-level endpoints:
            if "api/" in endpoint and re.search("<.*>", endpoint) is None:
                endpoints.append("http://localhost:8000/%s" % endpoint)
        return Response(endpoints)


class UserViewSet(viewsets.ViewSet):

    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request):
        '''
        List all users in the database. Requires current user
        to be a super user.
        '''
        order_by = request.GET.get("order_dir")
        if request.GET.get("count") is not None:
            return Response({"count": User.objects.count()}, status=200)
        query = User.objects.all()
        if order_by is not None:
            if order_by == "ASC":
                query = query.order_by("username")
            elif order_by == "DESC":
                query = query.order_by("-username")
        if request.user.is_superuser:
            results = []
            for user in query:
                friends_data = [{"id": friend.pk, "username":friend.username, "score": friend.score} for friend in user.friends.all()]
                results.append(
                    {"id": user.pk,
                     "username": user.username,
                     "email": user.email,
                     "score": user.score,
                     "friends": friends_data,
                     "url": "http://localhost:8000/api/users/%s" % user.pk},
                )
            usernames = [user.username for user in query]
            return Response(results)
        elif request.user.is_authenticated:
            user = get_object_or_404(User, pk=request.user.pk)
            friends_data = [{"id": friend.pk, "username":friend.username, "score": friend.score} for friend in user.friends.all()]
            results = {"id": user.pk,
                       "username": user.username,
                       "email": user.email,
                       "score": user.score,
                       "friends": friends_data,
                       "url": "http://localhost:8000/api/users/%s" % user.pk}
            return Response(results)
        else:
            return Response({"error": "You must be superuser to access this endpoint."}, status=403)

    def _check_parameters(self, payload):
        for required in ["username", "password1", "password2", "email"]:
            if not(required) in payload:
                raise ValidationError("Missing argument in request: %s" % required)
        if User.objects.filter(username=payload["username"]).exists():
            raise ValidationError("Username already exists.")
        if payload["password1"] != payload["password2"]:
            raise ValidationError("Password do not match")

    def create(self, request):
        '''
        Create a new user in the database
        '''
        payload = request.data
        self._check_parameters(payload)
        user = User.objects.create(
            username=payload["username"],
            email=payload["email"],
            is_active=True
        )
        user.set_password(payload["password1"])
        return Response(payload, status=201)

    def retrieve(self, request, pk):
        '''
        Retrieve details for user with given primary key.
        '''
        if request.user.is_superuser:
            user = get_object_or_404(User, pk=pk)
            friends_data = [{"id": friend.pk, "username":friend.username, "score": friend.score} for friend in user.friends.all()]
            return Response(
                {
                    "id": user.pk,
                    "username": user.username,
                    "email": user.email,
                    "score": user.score,
                    "friends": friends_data,
                    "is_active": user.is_active,
                    "groups": "http://localhost:8000/api/users/%s/groups" % user.pk,
                    "security": "http://localhost:8000/api/users/%s/security" % user.pk,
                }
            )
        elif request.user.is_authenticated:
            if request.user.pk == int(pk):
                user = get_object_or_404(User, pk=pk)
                friends_data = [{"id": friend.pk, "username":friend.username, "score": friend.score} for friend in user.friends.all()]
                return Response(
                    {
                        "id": user.pk,
                        "username": user.username,
                        "email": user.email,
                        "score": user.score,
                        "friends": friends_data,
                        "is_active": user.is_active,
                    }
                )
            else:
                return Response({"error": f"You can only access your own userdata at: http://localhost:8000/api/users/{request.user.pk}"}, status=403)
        else:
            return Response({"error": "You must be superuser to access this endpoint."}, status=403)

    def update(self, request, pk=None):
        '''
        Updates user with primary key pk.
        '''
        try:
            if request.user.is_superuser or request.user.pk == int(pk):
                queries = request.query_params
                

                user = get_object_or_404(User, pk=pk)
                payload = request.data
                if "add_friend" in queries:
                    friend = get_object_or_404(User, username=queries["add_friend"])
                    user.add_friend(friend)
                    payload["friends"]= f"friend with pk {friend.pk} added successfully"
                if "remove_friend" in queries:
                    friend = get_object_or_404(User, username=queries["remove_friend"])
                    user.remove_friend(friend)
                    payload["friends"]= f"friend with pk {friend.pk} removed successfully"

                if "score_add" in queries:
                    user.score += (int)(queries["score_add"])
                    payload["score"] = f'{queries["score_add"]} added to score of user {user.username}. Current score: {user.score}'


                if "username" in payload:
                    user.username = payload["username"]
                if "password1" and "password2" in payload:
                    if payload["password1"] != payload["password2"]:
                        raise ValidationError("Password do not match")
                    user.set_password(payload["password1"])
                if "email" in payload:
                    user.email = payload["email"]
                user.save()
                return Response(payload, status=200)
            else:
                return Response({"error": "You must be superuser to access this endpoint OR be the owner of user object."}, status=403)
        except Exception as e:
            raise ValidationError(f"You did something wrong that was unexpected: {e}")
    

    def destroy(self, request, pk=None):
        '''
        Deletes user with primary key pk
        '''
        if request.user.is_superuser or request.user.pk == int(pk):
            user = get_object_or_404(User,pk=pk)
            for friend in user.friends.all():
                user.remove_friend(friend)
            User.objects.filter(pk=pk).delete()
            return Response(status=204)
        return Response({"error": "You must be superuser to delete user accounts OR be the owner of user object."}, status=403)


class SecurityViewSet(viewsets.ViewSet):

    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request, user_pk):
        '''
        List active state of user and date of last login.
        '''
        user = get_object_or_404(User, pk=user_pk)
        return Response({"is_active": user.is_active, "last_login": user.last_login, "is_superuser": user.is_superuser})

    def update(self, request, user_pk):
        '''
        Updates the user password of given user.
        '''
        if request.user.is_superuser or request.user.pk == int(user_pk):
            payload = request.data
            user = get_object_or_404(User, pk=user_pk)
            if not("password1" in payload) or not("password2" in payload):
                raise ValidationError("Passwords did not match.")
            user.set_password(payload["password1"])
            if "is_active" in payload:
                user.is_active = payload["is_active"]
            user.save()
            return Response({"message": "Password updated."}, status=200)
        else:
            return Response({"error": "You must be superuser to access this endpoint OR be the owner of user object."}, status=403)


class UserGroupViewSet(viewsets.ViewSet):

    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request, user_pk):
        '''
        Lists all groups of the given user.
        '''
        user = get_object_or_404(User, pk=user_pk)
        return Response([{"name": group.name, "url": "http://localhost:8000/api/users/%s/groups/%s" % (user.pk, group.pk)}
                         for group in user.groups.all()])

    def retrieve(self, request, user_pk, group_pk):
        '''
        Shows details of an assigned group
        '''
        user = get_object_or_404(User, pk=user_pk)
        group = get_object_or_404(Group, pk=group_pk)
        return Response(
            {"name": group.name}
        )

    def destroy(self, request, user_pk, group_pk):
        '''
        Deletes user group assignment (not the group itself)
        '''
        user = get_object_or_404(User, pk=user_pk)
        group = get_object_or_404(Group, pk=group_pk)
        user.groups.remove(group)
        return Response(status=204)

    def create(self, request, user_pk):
        '''
        Creates new group assignment for a given user.
        '''
        user = get_object_or_404(User, pk=user_pk)
        payload = request.data
        if not("groups" in payload):
            raise ValidationError("Missing property 'groups' - should be a list.")
        for group_name in payload["groups"]:
            group = get_object_or_404(Group, pk=user_pk)
            user.groups.add(group)
        return Response(payload, status=201)


class GroupViewSet(viewsets.ViewSet):

    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request):
        '''
        Lists all groups in the database
        '''
        # Pass the query to the serializer. It will automatically convert every
        # entry in the query to a JSON object - many=True will pack the result
        # in a list:
        serializer = serializers.GroupSerializer(Group.objects.all(), many=True)
        return Response(serializer.data)

    def create(self, request):
        '''
        Creates a new group in the database.
        '''
        if not(request.user.is_superuser):
            return Response({"error": "You need to be super user to perform this action."}, status=403)
        # Pass the request data to the serializer, it will take
        # care of the validation
        serializer = serializers.GroupSerializer(data=request.data)
        # Test, if the input data is correct. The raise_exception argument
        # tells the Django Rest Framework to automatically create an error
        # message and return a HTTP 400 Bad Request Error
        if serializer.is_valid(raise_exception=True):
            # This will invoke the "create" method of the serializer
            serializer.save()
        # Return a proper response:
        return Response(serializer.data, status=201)

    def retrieve(self, request, group_pk):
        '''
        Retrieves a group from the database.
        '''
        group = get_object_or_404(Group, pk=group_pk)
        serializer = serializers.GroupSerializer(group)
        return Response(serializer.data)

    def update(self, request, group_pk):
        '''
        Updates a group in the database.
        '''
        if request.user.is_superuser:
            group = get_object_or_404(Group, pk=group_pk)
            serializer = serializers.GroupSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response({"status": "updated"}, status=200)
        return Response({"error": "You must be superuser to delete user accounts."}, status=403)

    def destroy(self, request, group_pk):
        '''
        Deletes a group from the database
        '''
        if request.user.is_superuser:
            User.objects.filter(pk=group_pk).delete()
            return Response(status=204)
        return Response({"error": "You must be superuser to delete user accounts."}, status=403)


