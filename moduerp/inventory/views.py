# inventory/views.py
from rest_framework import viewsets # Create CRUD API
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import UnitOfMeasure, ProductCategory, ProductTemplate, ProductVariant
from .serializers import (
    UnitOfMeasureSerializer,
    ProductCategorySerializer,
    ProductTemplateSerializer,
    ProductVariantSerializer,
)


class UnitOfMeasureViewSet(viewsets.ModelViewSet):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitOfMeasureSerializer


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductTemplateViewSet(viewsets.ModelViewSet):
    queryset = ProductTemplate.objects.prefetch_related("variants").all()
    serializer_class = ProductTemplateSerializer

    @action(detail=True, methods=["get"])
    def variants(self, request, pk=None):
        """Get all variants of a product template"""
        template = self.get_object()
        variants = template.variants.all()
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related("template").all()
    serializer_class = ProductVariantSerializer
