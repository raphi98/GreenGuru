# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    score = models.IntegerField(default=0, null=False, help_text="plantscore of the user")
    friends = models.ManyToManyField("self",default=None, help_text="friendlist of the user")

    def add_friend(self, friend):
        """
        Add a user to the friends list.
        """
        self.friends.add(friend)
        friend.friends.add(self)  # Automatically add the user to the friend's friends list
        self.save()
        friend.save()

    def remove_friend(self, friend):
        """
        Remove a user from the friends list.
        """
        self.friends.remove(friend)
        friend.friends.remove(self)  # Automatically remove the user from the friend's friends list
        self.save()
        friend.save()

    def __str__(self):
        return self.username