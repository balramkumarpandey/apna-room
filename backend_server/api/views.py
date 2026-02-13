import threading # <--- 1. Import threading
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework import viewsets, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Room, TenantInquiry, LandlordInquiry, Colony
from .serializers import RoomSerializer, TenantInquirySerializer, LandlordInquirySerializer, ColonySerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.prefetch_related('images').all()
    serializer_class = RoomSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['room_type', 'is_available', 'colony_name', 'tenant_type']
    search_fields = [
        'title', 
        'description', 
        'colony_name__name', 
        'address', 
        'price',
        'room_type',
        'tenant_type'
    ]
    ordering_fields = ['price', 'created_at']

# --- OPTIMIZED VIEWS WITH BACKGROUND EMAIL ---

class TenantInquiryCreateView(generics.CreateAPIView):
    queryset = TenantInquiry.objects.all()
    serializer_class = TenantInquirySerializer

    def perform_create(self, serializer):
        # Save to Database (Fast)
        instance = serializer.save()
        
        # Define the Email Task (To run in background)
        def send_email_task():
            try:
                subject = f"New Inquiry: {instance.name}"
                if "BOOKING:" in instance.name:
                    subject = f"💰 PAYMENT RECEIVED: {instance.name}"
                
                message = f"""
                New Inquiry Received!
                
                Name: {instance.name}
                Phone: {instance.phone_number}
                Room: {instance.room.title} (ID: {instance.room.id})
                Landlord: {instance.room.landlord_name} ({instance.room.landlord_phone})
                """

                email = EmailMessage(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ['kpbalram810@gmail.com'],
                )

                if instance.payment_screenshot:
                    content_type = 'image/jpeg' 
                    if instance.payment_screenshot.name.endswith('.png'):
                        content_type = 'image/png'
                    
                    # We must open the file again because the request is closed
                    instance.payment_screenshot.open()
                    email.attach(instance.payment_screenshot.name, instance.payment_screenshot.read(), content_type)
                    instance.payment_screenshot.close()

                email.send(fail_silently=False)
            except Exception as e:
                print(f"Background Email Error: {e}")

        # 3. Start the Background Thread (Instant Response to User)
        threading.Thread(target=send_email_task).start()


class LandlordInquiryCreateView(generics.CreateAPIView):
    queryset = LandlordInquiry.objects.all()
    serializer_class = LandlordInquirySerializer

    def perform_create(self, serializer):
        instance = serializer.save()

        def send_landlord_email():
            try:
                subject = "🏠 New Property Listing Request"
                message = f"""
                Someone wants to list their property!

                Name: {instance.name}
                Phone: {instance.phone_number}
                Location: {instance.address}
                """

                email = EmailMessage(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ['kpbalram810@gmail.com'],
                )
                email.send(fail_silently=False)
            except Exception as e:
                print(f"Landlord Email Error: {e}")

        threading.Thread(target=send_landlord_email).start()

class ColonyListView(generics.ListAPIView):
    queryset = Colony.objects.all()
    serializer_class = ColonySerializer