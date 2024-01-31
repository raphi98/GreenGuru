"""wapdev2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from userapi import views as user_views
from plants import views as plants_views

urlpatterns = [
    # Django Admin URLs:
    path('admin/', admin.site.urls),
    # user and authentication apis:
    path('api/', user_views.ApiView.as_view({'get': "list"}), name="api"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', user_views.UserViewSet.as_view({"get": "list",
                                                       "post": "create"}),name="api_users"),
    path('api/users/<pk>', user_views.UserViewSet.as_view({"get": "retrieve",
                                                           "put": "update",
                                                           "delete": "destroy", })),
    path('api/users/<user_pk>/security', user_views.SecurityViewSet.as_view({"put": "update", "get": "list"}), name="api_security"),
    path('api/users/<user_pk>/groups', user_views.UserGroupViewSet.as_view({"post": "create", "get": "list"})),
    path('api/users/<user_pk>/groups/<group_pk>', user_views.UserGroupViewSet.as_view({"delete": "destroy", "get": "retrieve"})),
    path('api/groups', user_views.GroupViewSet.as_view({'get': "list", "post": "create"})),
    path('api/groups/<group_pk>', user_views.GroupViewSet.as_view({'put': "update", "delete": "destroy", "get": "retrieve"})),
 
    # plant api urls
    path('api/plants/', plants_views.PlantAPIViewSet.as_view({"get": "list", "post": "create"}), name="plants_api"),
    path('api/plants/<int:pk>/', plants_views.PlantAPIViewSet.as_view({"put": "update", "delete": "destroy", "get": "retrieve"}), name="plants_api"),
    path('api/plants/<int:pk>/image', plants_views.PlantImageViewSet.as_view({"get": "retrieve", "post": "create"})),
    path('api/plants/reminder', plants_views.PlantReminderViewSet.as_view({"get": "list"}), name="plants_reminder")
]

if settings.DEBUG:
    # Adding "static" to the urlpatterns makes all file uploads visible in the admin.
    # This is OK on development servers (hence, the settings.DEBUG check) but should never
    # be deployed to production environments as it exposes all uploads to the world.
    urpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
