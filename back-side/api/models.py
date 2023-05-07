import datetime

from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.id} - {self.name}'

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = "Categories"


class Video(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(default="")
    video_url = models.CharField(max_length=500)
    image_url = models.CharField(max_length=500)
    total_views = models.IntegerField(default=0)
    upload_time = models.DateTimeField(default=datetime.datetime.now)
    total_duration = models.CharField(default="", max_length=255)



class UserVideoIntermediate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    isLiked = models.IntegerField(default=0)
    isViewed = models.BooleanField(default=True)


class Subscription(models.Model):
    channel = models.ForeignKey(User, related_name='channel', on_delete=models.CASCADE)
    follower = models.ForeignKey(User, related_name='follower', on_delete=models.CASCADE)
    isSubscribed = models.IntegerField(default=0)

