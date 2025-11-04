from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_elasticsearch_dsl_drf.filter_backends import (
    SearchFilterBackend,
    FilteringFilterBackend,
)
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination

from .models import Bike, StolenBikeReport
from .serializers import BikeSerializer, StolenBikeReportSerializer
from search.documents import BikeDocument
from search.serializers import BikeDocumentSerializer

class BikeViewSet(viewsets.ModelViewSet):
    serializer_class = BikeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Bike.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'])
    def report_stolen(self, request, pk=None):
        bike = self.get_object()
        serializer = StolenBikeReportSerializer(data=request.data)
        
        if serializer.is_valid():
            report = serializer.save(
                bike=bike,
                reported_by=request.user
            )
            bike.mark_stolen(
                theft_location=request.data.get('last_seen_location'),
                theft_date=request.data.get('last_seen_date'),
                description=request.data.get('additional_details', '')
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StolenBikeReportViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StolenBikeReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StolenBikeReport.objects.filter(is_active=True)

class BikeSearchView(DocumentViewSet):
    document = BikeDocument
    serializer_class = BikeDocumentSerializer
    pagination_class = PageNumberPagination
    
    filter_backends = [
        FilteringFilterBackend,
        SearchFilterBackend,
    ]
    
    search_fields = ('vin', 'engine_number', 'license_plate', 'make', 'model')
    filter_fields = {
        'status': 'status',
        'make': 'make',
        'model': 'model',
        'year': 'year',
        'color': 'color',
    }
    
    def list(self, request, *args, **kwargs):
        # Allow search without authentication for public access
        return super().list(request, *args, **kwargs)
