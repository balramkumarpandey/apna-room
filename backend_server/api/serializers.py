from rest_framework import serializers
from .models import Room, RoomImage, TenantInquiry, LandlordInquiry, Colony

class ColonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Colony
        fields = ['id', 'name']

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image']

class RoomSerializer(serializers.ModelSerializer):
    # This nests the images inside the room data
    images = RoomImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Room
        fields = [
        'id', 'title', 'price', 'description', 'address', 
        'colony_name', 'images', 'video', 'room_type', 
        'is_available', 'tenant_type', 
        'place_name', 'distance_km'
    ]
class TenantInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantInquiry
        fields = ['id', 'room', 'name', 'phone_number', 'payment_screenshot']

class LandlordInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = LandlordInquiry
        fields = ['name', 'phone_number', 'address']