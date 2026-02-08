from django.contrib import admin
from django.utils.html import format_html  # For making HTML safe
from django.urls import reverse  # For creating links to related objects
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
    # Update list_display to use the NEW link function
    list_display = ('name', 'phone_number', 'get_room_link', 'get_broker_name', 'get_broker_phone')
    
    search_fields = ('name', 'phone_number', 'room__title', 'room__landlord_name')

    # --- Link to the LIST View ---
    def get_room_link(self, obj):
        if obj.room:
            # Get the URL for the "Room List" page (changelist)
            # Pattern: admin:<app_label>_<model_name>_changelist
            base_url = reverse("admin:api_room_changelist")
            
            # 2. Add a filter to show ONLY this specific room (by ID)
            # This creates: /admin/api/room/?id__exact=5
            url = f"{base_url}?id__exact={obj.room.id}"
            
            # 3. Return the clickable link
            return format_html('<a href="{}">{}</a>', url, obj.room.title)
        return "-"
    
    get_room_link.short_description = 'Interested Room (Go to List)'

    # Helper function to show Broker Name
    def get_broker_name(self, obj):
        return obj.room.landlord_name
    get_broker_name.short_description = 'Broker/Landlord Name'

    # Helper function to show Broker Phone
    def get_broker_phone(self, obj):
        return obj.room.landlord_phone
    get_broker_phone.short_description = 'Broker Phone'

# Register the models
admin.site.register(Room, RoomAdmin)
admin.site.register(LandlordInquiry)
admin.site.register(TenantInquiry, TenantInquiryAdmin)