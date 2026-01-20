from .models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "password", "phone_number", "town", "suburb", "is_provider")

    def create(self, validated_data):
        user = User(
            username = validated_data["username"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            email = validated_data["email"],
            is_provider = validated_data.get("is_provider", False),
            phone_number = validated_data.get("phone_number", ""),
            town = validated_data.get("town", ""),
            suburb = validated_data.get("suburb", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
    

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "phone_number", "town", "suburb", "is_provider"]