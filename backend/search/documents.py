from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from bikes.models import Bike, StolenBikeReport

@registry.register_document
class BikeDocument(Document):
    owner = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
    })
    
    class Index:
        name = 'bikes'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }
    
    class Django:
        model = Bike
        fields = [
            'id',
            'vin',
            'engine_number',
            'license_plate',
            'make',
            'model',
            'year',
            'color',
            'bike_type',
            'status',
            'created_at',
            'updated_at',
        ]
    
    def get_queryset(self):
        return super().get_queryset().select_related('owner')
    
    def get_indexing_queryset(self):
        return self.get_queryset()
