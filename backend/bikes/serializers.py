from rest_framework import serializers
from .models import Bike, StolenBikeReport

class BikeSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    is_stolen = serializers.SerializerMethodField()
    
    class Meta:
        model = Bike
        fields = [
            'id', 'vin', 'engine_number', 'license_plate', 'make', 'model',
            'year', 'color', 'bike_type', 'status', 'owner', 'owner_name',
            'main_image', 'is_stolen', 'created_at'
        ]
        read_only_fields = ['owner', 'status', 'created_at']
    
    def get_is_stolen(self, obj):
        return obj.status == 'STOLEN'
    
    def validate_vin(self, value):
        if len(value) != 17:
            raise serializers.ValidationError("VIN must be 17 characters long")
        return value.upper()

class StolenBikeReportSerializer(serializers.ModelSerializer):
    bike_details = BikeSerializer(source='bike', read_only=True)
    
    class Meta:
        model = StolenBikeReport
        fields = [
            'id', 'bike', 'bike_details', 'reported_by', 'reported_at',
            'last_seen_location', 'last_seen_date', 'police_report_number',
            'contact_phone', 'additional_details', 'is_active'
        ]
        read_only_fields = ['reported_by', 'reported_at']
