import datetime
from abc import ABC

from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from api.models import Category, Video, UserVideoIntermediate


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class UserSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=make_password(validated_data['password'])
        )
        user.save()
        return user


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()

    def create(self, validated_data):
        category = Category.objects.create(**validated_data)
        return category

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        return instance


class VideoSerializerModel(serializers.ModelSerializer):
    owner = UserSerializer(fields=['id', 'username', 'first_name', 'last_name', 'avatar', 'description'])
    category = CategorySerializer()

    class Meta:
        model = Video
        fields = "__all__"


class VideoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    owner_id = serializers.IntegerField()
    category_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(min_length=0)
    video_url = serializers.CharField(max_length=500)
    image_url = serializers.CharField(max_length=500)
    total_views = serializers.IntegerField(read_only=True)
    upload_time = serializers.DateTimeField(read_only=True)
    total_duration = serializers.CharField(max_length=255)

    def create(self, validated_data):
        video = Video.objects.create(**validated_data)
        return video


class UserVideoInterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    isLiked = serializers.IntegerField()
    isViewed = serializers.BooleanField()
    user_id = serializers.IntegerField()
    video_id = serializers.IntegerField()

    def create(self, validated_data):
        userVideoIntermediate = UserVideoIntermediate.objects.create(**validated_data)
        return userVideoIntermediate

    def update(self, instance, validated_data):
        instance.isLiked = validated_data.get('isLiked', instance.isLiked)
        instance.isViewed = validated_data.get('isViewed', instance.isViewed)
        return instance
