from rest_framework import serializers
from .models import Category, ServiceListing
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer # type: ignore

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id","name","slug"]

class ServiceListingSerializer(serializers.ModelSerializer):
    provider = UserSerializer(read_only=True)

    class Meta:
        model = ServiceListing
        fields = [
            "id","provider","title","description","category","price",
            "town","suburb","image","is_active","created_at","updated_at"
        ]
        read_only_fields = ["provider","created_at","updated_at"]

User = get_user_model()

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "town",
            "suburb",
            "is_provider",
            "profile_picture",
            "bio",
        )