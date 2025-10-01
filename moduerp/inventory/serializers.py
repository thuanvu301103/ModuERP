'''Django REST Framework (DRF):
- Transform data in Model → JSON (return client through API).
- Validate & transform JSON → Model (when client send request POST/PUT/PATCH).
'''
from django.db import transaction
from rest_framework import serializers
from .models import (
    ProductCategory, ProductCategoryClosure,
    UomCategory, UnitOfMeasure, ProductTemplate, ProductVariant
)

#----- Products -----#
class ProductCategorySerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(allow_null=False, read_only=True)  
    parent_id = serializers.IntegerField(required=False, allow_null=True)
    path = serializers.CharField(read_only=True)

    class Meta:
        model = ProductCategory
        fields = "__all__"

    def validate_parent_id(self, value):
        if value is None:
            return value    # Root node
        errors = []
        try:
            parent = ProductCategory.objects.get(pk=value)
        except ProductCategory.DoesNotExist:
            errors.append(f"Parent category with id {value} does not exist.")
        if errors:
            raise serializers.ValidationError(errors)  
        return value

    @transaction.atomic
    def create(self, validated_data):
        parent_id = validated_data.pop("parent_id", None)
        category = ProductCategory.objects.create(**validated_data)
        # Point to itself
        ProductCategoryClosure.objects.create(ancestor=category, descendant=category, depth=0)
        # Point to all its ancestors
        if parent_id:
            parent = ProductCategory.objects.get(pk=parent_id)
            parent_ancestors = ProductCategoryClosure.objects.filter(descendant=parent)
            for path in parent_ancestors:
                ProductCategoryClosure.objects.create(
                    ancestor=path.ancestor,
                    descendant=category,
                    depth=path.depth + 1
                )
        return category

class ProductCategoryClosureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategoryClosure
        fields = "__all__"

#----- Unit of Measure -----#
class UnitOfMeasureSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UnitOfMeasure
        fields = "__all__"

class UoMCategorySerializer(serializers.ModelSerializer):
    uoms = UnitOfMeasureSerializer(required=False, many=True)

    class Meta:
        model = UomCategory
        fields = "__all__"

    def validate_uoms(self, value):
        errors = []
        # Must have at least one UoM
        if not value:
            errors.append("At least one UoM must be provided")
            raise serializers.ValidationError(errors)
        # Only one UoM can be of type 'reference'
        reference_count = sum(1 for u in value if u.get('uom_type') == 'reference')
        if reference_count != 1:
            errors.append("There must be exactly one UoM with type='reference'")
        # Only one UoM can have is_default=True
        default_count = sum(1 for u in value if u.get('is_default'))
        if default_count != 1:
            errors.append("There must be exactly one UoM with is_default=True")
        # Check duplicate names within the same category
        names = [u.get('name') for u in value if u.get('name')]
        duplicates = [n for n in set(names) if names.count(n) > 1]
        if duplicates:
            errors.append(
                f"Duplicate UoM names are not allowed in the same category: {', '.join(duplicates)}"
            )
        
        if errors:
            raise serializers.ValidationError(errors)
        return value

    @transaction.atomic
    def create(self, validated_data):
        uoms_data = validated_data.pop("uoms", [])
        category = UomCategory.objects.create(**validated_data)
        for uom_data in uoms_data:
            UnitOfMeasure.objects.create(category=category, **uom_data)
        return category
    
    @transaction.atomic
    def update(self, instance, validated_data):
        uoms_data = validated_data.pop("uoms", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if uoms_data is not None:
            existing_uoms = {uom.id: uom for uom in instance.uoms.all()}

            for uom_data in uoms_data:
                uom_id = uom_data.get("id", None)

                if uom_id and uom_id in existing_uoms:
                    uom_instance = existing_uoms[uom_id]
                    for attr, value in uom_data.items():
                        setattr(uom_instance, attr, value)
                    uom_instance.save()
                else:
                    UnitOfMeasure.objects.create(category=instance, **uom_data)

            payload_ids = [u.get("id") for u in uoms_data if "id" in u]
            for uom_id, uom_instance in existing_uoms.items():
                if uom_id not in payload_ids:
                    uom_instance.delete()

        return instance

    




class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductTemplateSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = ProductTemplate
        fields = "__all__"
