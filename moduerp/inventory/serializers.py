'''Django REST Framework (DRF):
- Transform data in Model → JSON (return client through API).
- Validate & transform JSON → Model (when client send request POST/PUT/PATCH).
'''

from rest_framework import serializers
from .models import UoMCategory, UnitOfMeasure, ProductCategory, ProductTemplate, ProductVariant


class UoMCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UoMCategory
        fields = ["id", "name", "uoms"]

    def create(self, validated_data):
        uoms_data = validated_data.pop("uoms", [])
        category = UoMCategory.objects.create(**validated_data)
        for uom_data in uoms_data:
            UnitOfMeasure.objects.create(category=category, **uom_data)
        return category

class UnitOfMeasureSerializer(serializers.ModelSerializer):
    # hiển thị cả category_id và category name
    category = serializers.PrimaryKeyRelatedField(
        queryset=UoMCategory.objects.all()
    )
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = UnitOfMeasure
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "uom_type",
            "factor",
            "is_default",
        ]

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
