# inventory/views.py
import json
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import ProductTemplate

#----- Products -----#

@login_required
def product_list(request):
    return render(request, "products/product_list.html")

@login_required
def product_new(request):
    return render(request, "products/product_new.html")

#----- Unit of Measure -----#

@login_required
def uom_categories_list(request):
    return render(request, "uom/uomCategory_list.html")

@login_required
def uom_categories_new(request):
    return render(request, "uom/uomCategory_new.html")

# API
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import UomCategory, UnitOfMeasure, ProductCategory, ProductTemplate, ProductVariant
from .serializers import (
    UoMCategorySerializer,
    UnitOfMeasureSerializer,
    ProductCategorySerializer,
    ProductTemplateSerializer,
    ProductVariantSerializer,
)

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

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 24              # default page size
    page_size_query_param = "page_size"  # allow client to override
    max_page_size = 100         # maximum page size

class UomCategoryViewSet(viewsets.ModelViewSet):
    queryset = UomCategory.objects.all()
    serializer_class = UoMCategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset().order_by('id')
        domain_str = self.request.query_params.get("domain")
        if domain_str:
            try:
                domain = json.loads(domain_str)
                qs = apply_domain(qs, domain)
            except Exception as e:
                print("Domain parse error:", e)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            response_data = {
                "meta": {
                    "total": self.paginator.page.paginator.count,
                    "num_pages": self.paginator.page.paginator.num_pages,
                    "current_page": self.paginator.page.number,
                    "has_next": self.paginator.page.has_next(),
                    "has_previous": self.paginator.page.has_previous(),
                    "next_page_number": self.paginator.page.next_page_number() if self.paginator.page.has_next() else None,
                    "previous_page_number": self.paginator.page.previous_page_number() if self.paginator.page.has_previous() else None,
                },
                "results": serializer.data
            }
            return Response(response_data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "meta": {
                "total": len(queryset),
                "num_pages": 1,
                "current_page": 1,
                "has_next": False,
                "has_previous": False,
                "next_page_number": None,
                "previous_page_number": None
            },
            "results": serializer.data
        })

class UnitOfMeasureViewSet(viewsets.ModelViewSet):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitOfMeasureSerializer

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductTemplateViewSet(viewsets.ModelViewSet):
    queryset = ProductTemplate.objects.prefetch_related("variants").all()
    serializer_class = ProductTemplateSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset().filter(is_active=True).order_by('id')
        domain_str = self.request.query_params.get("domain")
        if domain_str:
            try:
                domain = json.loads(domain_str)
                qs = apply_domain(qs, domain)
            except Exception as e:
                print("Domain parse error:", e)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            response_data = {
                "meta": {
                    "total": self.paginator.page.paginator.count,
                    "num_pages": self.paginator.page.paginator.num_pages,
                    "current_page": self.paginator.page.number,
                    "has_next": self.paginator.page.has_next(),
                    "has_previous": self.paginator.page.has_previous(),
                    "next_page_number": self.paginator.page.next_page_number() if self.paginator.page.has_next() else None,
                    "previous_page_number": self.paginator.page.previous_page_number() if self.paginator.page.has_previous() else None,
                },
                "results": serializer.data
            }
            return Response(response_data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "meta": {
                "total": len(queryset),
                "num_pages": 1,
                "current_page": 1,
                "has_next": False,
                "has_previous": False,
                "next_page_number": None,
                "previous_page_number": None
            },
            "results": serializer.data
        })
   

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related("template").all()
    serializer_class = ProductVariantSerializer
