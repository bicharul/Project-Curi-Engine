from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Bike(models.Model):
    BIKE_TYPES = [
        ('SPORT', 'Sport'),
        ('CRUISER', 'Cruiser'),
        ('ADVENTURE', 'Adventure'),
        ('SCOOTER', 'Scooter'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('REGISTERED', 'Registered'),
        ('STOLEN', 'Stolen'),
        ('RECOVERED', 'Recovered'),
    ]
    
    # Ownership info
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bikes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Bike identification
    vin = models.CharField(max_length=17, unique=True, verbose_name="VIN")
    engine_number = models.CharField(max_length=50, unique=True)
    license_plate = models.CharField(max_length=20, blank=True, null=True)
    
    # Bike details
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=50)
    bike_type = models.CharField(max_length=20, choices=BIKE_TYPES)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REGISTERED')
    reported_stolen_at = models.DateTimeField(null=True, blank=True)
    recovered_at = models.DateTimeField(null=True, blank=True)
    
    # Theft details (filled when stolen)
    theft_location = models.TextField(blank=True, null=True)
    theft_date = models.DateTimeField(null=True, blank=True)
    theft_description = models.TextField(blank=True, null=True)
    
    # Images
    main_image = models.ImageField(upload_to='bike_images/', blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['vin']),
            models.Index(fields=['engine_number']),
            models.Index(fields=['license_plate']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.year} {self.make} {self.model} - {self.license_plate or 'No Plate'}"
    
    def mark_stolen(self, theft_location, theft_date, description=""):
        self.status = 'STOLEN'
        self.theft_location = theft_location
        self.theft_date = theft_date
        self.theft_description = description
        self.reported_stolen_at = timezone.now()
        self.save()
    
    def mark_recovered(self):
        self.status = 'RECOVERED'
        self.recovered_at = timezone.now()
        self.save()

class StolenBikeReport(models.Model):
    bike = models.OneToOneField(Bike, on_delete=models.CASCADE, related_name='stolen_report')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reported_at = models.DateTimeField(auto_now_add=True)
    last_seen_location = models.TextField()
    last_seen_date = models.DateTimeField()
    police_report_number = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20)
    additional_details = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Stolen report for {self.bike}"
