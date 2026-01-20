from django.shortcuts import render
from rest_framework.response import Response
from .models import Category, ServiceListing
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CategorySerializer, ServiceListingSerializer, ProviderSerializer

User = get_user_model()

# Create your views here.
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # write permissions only for the provider owner
        return hasattr(obj, "provider") and obj.provider == request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceListingViewSet(viewsets.ModelViewSet):
    queryset = ServiceListing.objects.filter(is_active=True).select_related("category","provider").order_by("-created_at")
    serializer_class = ServiceListingSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "town", "suburb", "provider"]
    search_fields = ["title", "description", "provider__username", "town", "suburb"]
    ordering_fields = ["created_at", "price"]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns all users who are providers (is_provider=True)
    """
    queryset = User.objects.filter(is_provider=True)
    permission_classes = [permissions.AllowAny]
    serializer_class = ProviderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["username", "first_name", "last_name", "email", "town", "suburb"]
    
    # Return minimal info (you can extend later)
    def list(self, request, *args, **kwargs):
        data = [
            {
                "id": u.id,
                "name": f"{u.first_name} {u.last_name}".strip() or u.username,
                "profile_picture": u.profile_picture.url if getattr(u, "profile_picture", None) else None,
                "service_type": getattr(u, "service_type", None),
                "town": getattr(u, "town", None),
                "suburb": getattr(u, "suburb", None),
            }
            for u in self.get_queryset()
        ]
        return Response(data)