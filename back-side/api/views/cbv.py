from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from api.models import Category, Subscription
from api.serializers import CategorySerializer, UserSerializer
from django.contrib.auth.models import User


class CategoryListAPIView(APIView):
    def get(self, request):
        serializer = CategorySerializer(Category.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailsAPIView(APIView):
    def get_category(self, category_id):
        category = Category.objects.get(id=category_id)
        return category

    def get(self, request, category_id):
        try:
            category = self.get_category(category_id)
        except Category.DoesNotExist as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, category_id):
        try:
            category = self.get_category(category_id)
        except Category.DoesNotExist as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CategorySerializer(instance=category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        try:
            category = self.get_category(category_id)
        except Category.DoesNotExist as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        category.delete()
        return Response({"Deleted": True})


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})


class UserSearchAPIView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.filter(username=username).get()
        except Category.DoesNotExist as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, fields=['id', 'username', 'first_name', 'last_name', 'avatar', 'description'])
        return Response(serializer.data)


class UserSubscribeAPIView(APIView):
    def put(self, request, user_id):
        try:
            subscription = Subscription.objects.get(channel_id=user_id, follower_id=request.user.id)
            if subscription.isSubscribed == 1:
                subscription.isSubscribed = 0
            else:
                subscription.isSubscribed = 1
            subscription.save()
        except Subscription.DoesNotExist as e:
            subscription = Subscription(channel_id=user_id, follower_id=request.user.id)
            subscription.isSubscribed = 1
            subscription.save()
            return Response({"Created": True}, status=status.HTTP_200_OK)
        return Response({"Subscription": 'Changed'}, status=status.HTTP_200_OK)


class subscribedUserAPIView(APIView):
    def get(self, request):
        users = User.objects.filter(
            pk__in=Subscription.objects.filter(follower_id=request.user.id, isSubscribed=1)
            .values_list('channel_id', flat=True)).all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
