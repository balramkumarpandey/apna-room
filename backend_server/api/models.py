from django.db import models


class Colony(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Colonies"

# Room Model
class Room(models.Model):
    TENANT_CHOICES = [
        ('BOYS', 'Boys Only'),
        ('GIRLS', 'Girls Only'),
        ('FAMILY', 'Family Only'),
        ('ANY', 'Anyone (Boys/Girls/Family)'),
    ]

    title = models.CharField(max_length=200)
    price = models.IntegerField(db_index=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField()
    colony_name = models.CharField(max_length=100, db_index=True)
    
    room_type = models.CharField(max_length=50, default='1_RK', db_index=True)
    is_available = models.BooleanField(default=True)
    video = models.FileField(upload_to='room_videos/', blank=True, null=True)

    google_map_link = models.URLField(blank=True, null=True, help_text="Google Maps link here")
    total_inventory = models.IntegerField(default=1, help_text="How many sets of this room are available?")
    
    broker_name = models.CharField(max_length=100, default="Office", help_text="Name of the Broker")
    broker_phone = models.CharField(max_length=15, default="", help_text="Phone number of Broker")

    landlord_name = models.CharField(max_length=100, blank=True, null=True, help_text="Name of the Landlord")
    landlord_phone = models.CharField(max_length=20, blank=True, null=True, help_text="Phone number of the Landlord")

    
    tenant_type = models.CharField(
        max_length=10, 
        choices=TENANT_CHOICES, 
        default='ANY',
        db_index=True,
        help_text="Who is this room for?"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.colony_name})"

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='room_images/')
    
    def __str__(self):
        return f"Image for {self.room.title}"

class TenantInquiry(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    
    # The Screenshot Field
    payment_screenshot = models.ImageField(upload_to='payment_proofs/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.name} for {self.room.title}"

class LandlordInquiry(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Landlord: {self.name}"