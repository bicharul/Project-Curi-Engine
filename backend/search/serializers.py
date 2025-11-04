from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .documents import BikeDocument

class BikeDocumentSerializer(DocumentSerializer):
    class Meta:
        document = BikeDocument
        fields = [
            'id', 'vin', 'engine_number', 'license_plate', 'make', 'model',
            'year', 'color', 'bike_type', 'status', 'owner'
        ]
