# inventory/views.py
from rest_framework import viewsets # Create CRUD API
from rest_framework.response import Response
from rest_framework.decorators import action

from django.shortcuts import render, get_object_or_404
from .models import ProductTemplate

# Add new products

# Get all products
def product_list(request):
    products = ProductTemplate.objects.all()
    if request.htmx:
        return render(request, "products/_product_cards.html", {"products": products})
    return render(request, "products/product_list.html", {"products": products})

def product_detail(request, pk):
    product = get_object_or_404(ProductTemplate, pk=pk)
    return render(request, "products/_product_detail.html", {"product": product})


# API
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
