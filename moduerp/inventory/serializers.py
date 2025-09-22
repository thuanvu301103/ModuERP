'''Django REST Framework (DRF):
- Transform data in Model → JSON (return client through API).
- Validate & transform JSON → Model (when client send request POST/PUT/PATCH).
'''

from rest_framework import serializers
from .models import UnitOfMeasure, ProductCategory, ProductTemplate, ProductVariant


class UnitOfMeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasure
        fields = "__all__"


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductTemplateSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = ProductTemplate
        fields = "__all__"
