from .models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ProviderSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Only returns users that are providers.
    """
    queryset = User.objects.filter(is_provider=True)
    serializer_class = ProviderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]