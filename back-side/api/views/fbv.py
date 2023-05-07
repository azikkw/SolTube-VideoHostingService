import datetime

from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.serializers import UserSerializer, VideoSerializerModel, VideoSerializer, UserVideoInterSerializer
from django.contrib.auth.models import User
from api.models import Video, UserVideoIntermediate, Subscription


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def user_details(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user, fields=('id', 'username', 'first_name', 'last_name', 'avatar', 'description'))
        return Response(serializer.data)
    if request.method == 'PUT':
        user = User.objects.get(id=request.user.id)
        if 'username' not in request.data:
            request.data['username'] = user.username
        if 'password' not in request.data:
            request.data['password'] = user.password
        else:
            request.data['password'] = make_password(request.data['password'])
        serializer = UserSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(data={"Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        user = User.objects.get(id=request.user.id)
        user.delete()
        return Response({"Deleted": True}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def video_list(request):
    if request.method == 'GET':
        videos = Video.objects.all()
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        request.data['owner_id'] = request.user.id
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def video_details(request, video_id):
    video = Video.objects.get(pk=video_id)
    if request.method == 'GET':
        try:
            userVideoInter = UserVideoIntermediate.objects.get(user_id=request.user.id, video_id=video.id)
        except UserVideoIntermediate.DoesNotExist as e:
            userVideoInter = UserVideoIntermediate(user_id=request.user.id, video_id=video.id)
            userVideoInter.save()
        video.total_views += 1
        video.save()
        serializer = VideoSerializerModel(video)
        return Response(serializer.data)
    if request.method == 'PUT':
        userVideoInter = UserVideoIntermediate.objects.get(user_id=request.user.id, video_id=video.id)
        if 'isLiked' in request.data:
            userVideoInter.isLiked = request.data['isLiked']
        if 'isViewed' in request.data:
            userVideoInter.isViewed = request.data['isViewed']
        userVideoInter.save()
        serializer = UserVideoInterSerializer(userVideoInter)
        return Response(serializer.data)
    if request.method == 'DELETE':
        if video.owner_id == request.user.id:
            video.delete()
            return Response({"Deleted": True}, status=status.HTTP_200_OK)
        return Response({"Message": "You don't have permission to delete"}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def user_videos(request, user_id):
    videos = Video.objects.filter(owner_id=user_id).all()
    if request.method == 'GET':
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def category_videos_list(request, category_id):
    videos = Video.objects.filter(category_id=category_id).all()
    if request.method == 'GET':
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def liked_videos(request):
    if request.method == 'GET':
        videos = Video.objects.filter(
            id__in=UserVideoIntermediate.objects.filter(user_id=request.user.id, isLiked=1)
            .values_list('video_id', flat=True)).all()
        print(videos)
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)


def subscribed_videos(request):
    if request.method == 'GET':
        videos = Video.objects.filter(
            owner_id__in=Subscription.objects.filter(follower_id=request.user.id, isSubscribed=1)
            .values_list('channel_id', flat=True)).all()
        print(videos)
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def watched_videos(request):
    if request.method == 'GET':
        videos = Video.objects.filter(
            id__in=UserVideoIntermediate.objects.filter(user_id=request.user.id, isViewed=1)
            .values_list('video_id', flat=True)).all()
        serializer = VideoSerializerModel(videos, many=True)
        return Response(serializer.data)
