'''Django REST Framework (DRF):
- Transform data in Model → JSON (return client through API).
- Validate & transform JSON → Model (when client send request POST/PUT/PATCH).
'''

from rest_framework import serializers
from .models import UoMCategory, UnitOfMeasure, ProductCategory, ProductTemplate, ProductVariant

class UnitOfMeasureSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UnitOfMeasure
        fields = "__all__"


class UoMCategorySerializer(serializers.ModelSerializer):
    uoms = UnitOfMeasureSerializer(required=False, many=True)

    class Meta:
        model = UoMCategory
        fields = "__all__"

    def validate_uoms(self, value):
        # Must have at least one UoM
        if not value:
            raise serializers.ValidationError("At least one UoM must be provided.")
        # Only one UoM can be of type 'reference'
        reference_count = sum(1 for u in value if u.get('uom_type') == 'reference')
        if reference_count != 1:
            raise serializers.ValidationError("There must be exactly one UoM with type='reference'.")
        # Only one UoM can have is_default=True
        default_count = sum(1 for u in value if u.get('is_default'))
        if default_count != 1:
            raise serializers.ValidationError("There must be exactly one UoM with is_default=True.")
        return value

    def create(self, validated_data):
        uoms_data = validated_data.pop("uoms", [])
        category = UoMCategory.objects.create(**validated_data)
        for uom_data in uoms_data:
            UnitOfMeasure.objects.create(category=category, **uom_data)
        return category
    

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
