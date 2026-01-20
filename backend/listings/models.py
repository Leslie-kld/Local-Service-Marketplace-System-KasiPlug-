from django.db import models
from django.conf import settings

# Create your models here.
class Category(models.Model):
    class Meta:
        verbose_name_plural = "Categories"

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)

    def __str__(self):
        return self.name
    

class ServiceListing(models.Model):
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True, related_name="listings")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    town = models.CharField(max_length=120)
    suburb = models.CharField(max_length=120, blank=True)
    image = models.ImageField(upload_to="listings/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.provider})"