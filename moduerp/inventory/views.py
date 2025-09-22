# inventory/views.py
from rest_framework import viewsets # Create CRUD API
from rest_framework.response import Response
from rest_framework.decorators import action

import json
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.core.paginator import Paginator
from .models import ProductTemplate

# Apply domain queery filter
def apply_domain(queryset, domain):
    q = Q()
    for cond in domain:
        if len(cond) != 3:
            continue

        field, operator, value = cond

        # Remove unecessary white spaces
        if isinstance(value, str):
            value = value.strip()

        if operator == "=":
            q &= Q(**{field: value})
        elif operator == "!=":
            q &= ~Q(**{field: value})
        elif operator == ">":
            q &= Q(**{f"{field}__gt": value})
        elif operator == ">=":
            q &= Q(**{f"{field}__gte": value})
        elif operator == "<":
            q &= Q(**{f"{field}__lt": value})
        elif operator == "<=":
            q &= Q(**{f"{field}__lte": value})
        elif operator == "ilike":
            q &= Q(**{f"{field}__icontains": value})
        elif operator == "not ilike":
            q &= ~Q(**{f"{field}__icontains": value})
        elif operator == "in":
            if isinstance(value, list):
                value = [v.strip() if isinstance(v, str) else v for v in value]
                q &= Q(**{f"{field}__in": value})

    return queryset.filter(q)

# Get all products
def product_list(request):
    if request.htmx:
        products_qs = ProductTemplate.objects.filter(is_active=True).order_by('id')   # Query set
    
        domain_str = request.GET.get("domain")
        if domain_str:
            try:
                domain = json.loads(domain_str)
                products_qs = apply_domain(products_qs, domain)
            except Exception as e:
                print("Domain parse error:", e)

        # Get pagination parameters from request
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 24))
        view_type = str(request.GET.get("view_type", 'gallery'))

        paginator = Paginator(products_qs, page_size)
        page_obj = paginator.get_page(page)

        context = {
            "products": page_obj.object_list,
            "meta": {
                "total": paginator.count,
                "num_pages": paginator.num_pages,
                "current_page": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
                "next_page_number": page_obj.next_page_number() if page_obj.has_next() else None,
                "previous_page_number": page_obj.previous_page_number() if page_obj.has_previous() else None,
            }
        }
    
        return render(request, "products/_product_list_view.html", {"products": context["products"], "meta": context["meta"], "view_type": view_type})
    return render(request, "products/product_list.html")

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
