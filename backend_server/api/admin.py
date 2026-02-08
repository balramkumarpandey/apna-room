from django.contrib import admin
from .models import Room, RoomImage, LandlordInquiry, TenantInquiry, Colony

admin.site.register(Colony)

# Custom Room Admin
class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'colony_name', 'price', 'broker_name', 'broker_phone', 'landlord_name', 'landlord_phone', 'is_available', 'google_map_link', 'total_inventory' )
    search_fields = ('title', 'colony_name', 'landlord_name')
    list_editable = ('total_inventory', 'is_available')
    list_filter = ('is_available', 'room_type')
    inlines = [RoomImageInline]

# Custom Tenant Inquiry Admin
class TenantInquiryAdmin(admin.ModelAdmin):
    # CORRECTED FIELD NAMES HERE:
    list_display = ('name', 'phone_number', 'get_room_name', 'get_broker_name', 'get_broker_phone')
    
    # Search by the correct field names
    search_fields = ('name', 'phone_number', 'room__title', 'room__landlord_name')

    # Helper function to show Room Name
    def get_room_name(self, obj):
        return obj.room.title
    get_room_name.short_description = 'Interested Room'

    # Helper function to show Broker Name
    def get_broker_name(self, obj):
        return obj.room.landlord_name
    get_broker_name.short_description = 'Broker/Landlord Name'

    # Helper function to show Broker Phone
    def get_broker_phone(self, obj):
        return obj.room.landlord_phone
    get_broker_phone.short_description = 'Broker Phone'

# Register the models with the new settings
admin.site.register(Room, RoomAdmin)
admin.site.register(LandlordInquiry)
admin.site.register(TenantInquiry, TenantInquiryAdmin)