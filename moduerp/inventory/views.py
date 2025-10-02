# inventory/views.py
import json
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import ProductTemplate

#----- Products -----#

@login_required
def product_categories_list(request):
    return render(request, "products/productCategory_list.html")

@login_required
def product_list(request):
    return render(request, "products/product_list.html")

@login_required
def product_new(request):
    return render(request, "products/product_new.html")

#----- Unit of Measure -----#

@login_required
def uom_categories_new(request):
    return render(request, "uom/pages/uom_category_new.html")

@login_required
def uom_categories_list(request):
    return render(request, "uom/pages/uom_category_list.html")

@login_required
def uom_categories_detail(request, id):
    return render(request, "uom/pages/uom_category_detail.html")

# API
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import (
    UomCategory, UnitOfMeasure, 
    ProductCategory, ProductCategoryClosure, ProductTemplate, ProductVariant
)
from .serializers import (
    UoMCategorySerializer, UnitOfMeasureSerializer,
    ProductCategorySerializer, ProductCategoryClosureSerializer,
    ProductTemplateSerializer,
    ProductVariantSerializer,
)
from django.db.models import Count, Max, F, Subquery, OuterRef
from django.contrib.postgres.aggregates import StringAgg

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
    page_size = 25              # default page size
    page_size_query_param = "page_size"  # allow client to override
    max_page_size = 100         # maximum page size

#----- Products -----#
class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name']

    def get_queryset(self):
        # Sub query to get direct parent
        parent_subquery = ProductCategoryClosure.objects.filter(
            descendant=OuterRef('descendant'),
            depth=1
        ).order_by('depth')
        qs = (
            ProductCategoryClosure.objects.annotate(
                category_id=F('descendant__id'),
                name=F('descendant__name'),
            )
            .values('category_id', 'name')
            .annotate(
                path=StringAgg(
                    F('ancestor__name'),
                    delimiter=' / ',
                    ordering='-depth'
                ),
                parent_id=Subquery(parent_subquery.values('ancestor_id')[:1])                
            )
            .order_by('name')
        )

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

#----- Unit of Measure -----#
class UomCategoryViewSet(viewsets.ModelViewSet):
    queryset = UomCategory.objects.all()
    serializer_class = UoMCategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name']

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
