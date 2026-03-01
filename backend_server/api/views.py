import json
import requests
import threading
from django.core.mail import EmailMessage
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
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
        'colony_name', 
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
                if "BOOKING:" in instance.name or "VISIT BOOKING:" in instance.name:
                    subject = f"💰 ₹99 PAYMENT RECEIVED: {instance.name}"
                
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
                    
                    instance.payment_screenshot.open()
                    email.attach(instance.payment_screenshot.name, instance.payment_screenshot.read(), content_type)
                    instance.payment_screenshot.close()

                email.send(fail_silently=False)
            except Exception as e:
                print(f"Background Email Error: {e}")

        # Start the Background Thread
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


META_VERIFY_TOKEN = "apnaroom_secure_token_2026"
META_ACCESS_TOKEN = "EAAdW7w2yz5oBQ64jL1jHWAzDzCPSgjSdNG1EFGilov7A3LjajzfmZCREssSQStENsvadnmfu8kVYy8vHg0QCiZCZBwLXWi9crdUq53dHGmW55dQXETYyqo7FIOuFThUqUS0NL8FFlr6tF975WLPs1zz3O61qDMjaWfenhLb4Vi3pRZACHzQm4HDfwdpSjIhGnAScc8TTnXelFYhBfl0V1iKzFcRr29B38t0PDldkwbZBC3MRN36tO61z95NTsaC6dlwoIlZAe4c0tAn9iKkDR0ZCLUFZBJ3nJYwzpbYzcgZDZD"
META_PHONE_NUMBER_ID = "1061229450396582"
ADMIN_NUMBER = "919548484981"

@csrf_exempt
def whatsapp_webhook(request):
    #  META VERIFICATION (Required by Facebook to connect)
    if request.method == "GET":
        mode = request.GET.get("hub.mode")
        token = request.GET.get("hub.verify_token")
        challenge = request.GET.get("hub.challenge")

        if mode == "subscribe" and token == META_VERIFY_TOKEN:
            return HttpResponse(challenge, status=200)
        return HttpResponse("Verification failed", status=403)

    #  RECEIVE INCOMING MESSAGES
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Navigate Meta's JSON Structure
            entry = data.get('entry', [])[0]
            changes = entry.get('changes', [])[0]
            value = changes.get('value', {})
            
            # CRITICAL CHECK: Only process actual messages, ignore "read/delivered" receipts
            if 'messages' in value:
                message = value['messages'][0]
                
                # Get sender phone and the text they typed
                sender_phone = message.get('from')
                text_received = message.get('text', {}).get('body', '').strip()

                if not text_received:
                    return HttpResponse("EVENT_RECEIVED", status=200)

                # --- IF THE ADMIN (YOU) SENDS A MESSAGE ---
                if sender_phone == ADMIN_NUMBER:
                    if text_received.upper().startswith("APPROVE"):
                        try:
                            # You will type: "APPROVE 9876543210"
                            tenant_phone = text_received.split(" ")[1]
                            
                            # Find the tenant's latest inquiry
                            inquiry = TenantInquiry.objects.filter(phone_number__icontains=tenant_phone).order_by('-created_at').first()
                            
                            if inquiry:
                                # Send details to tenant
                                send_landlord_details_whatsapp(tenant_phone, inquiry.room)
                                # Notify yourself
                                send_simple_whatsapp(ADMIN_NUMBER, f"✅ Details sent successfully to {tenant_phone}")
                            else:
                                send_simple_whatsapp(ADMIN_NUMBER, f"❌ Could not find an inquiry for {tenant_phone}")
                        
                        except IndexError:
                            # If you type just "APPROVE" without a number
                            send_simple_whatsapp(ADMIN_NUMBER, "⚠️ Please format like this: APPROVE 9876543210")
                        
                        return HttpResponse("EVENT_RECEIVED", status=200)

                # ---  IF A TENANT SENDS A MESSAGE ---
                else:
                    # Tell them to wait for verification
                    send_simple_whatsapp(
                        sender_phone, 
                        "⏳ We have received your message! Please wait 2-5 minutes while our team verifies the ₹99 payment with the bank. You will receive the landlord details shortly."
                    )

        except Exception as e:
            print(f"Webhook Error: {e}")

        # Always return 200 OK so Meta doesn't keep resending the message
        return HttpResponse("EVENT_RECEIVED", status=200)


# --- WHATSAPP SENDER FUNCTIONS ---

def send_simple_whatsapp(to_number, text):
    """Utility to send simple text messages"""
    url = f"https://graph.facebook.com/v18.0/{META_PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {META_ACCESS_TOKEN}", "Content-Type": "application/json"}
    payload = {"messaging_product": "whatsapp", "to": to_number, "type": "text", "text": {"body": text}}
    requests.post(url, headers=headers, json=payload)

def send_landlord_details_whatsapp(to_phone_number, room):
    """Sends the landlord details to the tenant."""
    url = f"https://graph.facebook.com/v18.0/{META_PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {META_ACCESS_TOKEN}", "Content-Type": "application/json"}
    
    reply_text = f"""✅ *Payment Verified!*
    
Here are the details for your room visit in {room.colony_name}:

👤 *Owner Name:* {room.landlord_name or 'Not Provided'}
📞 *Contact Number:* {room.landlord_phone or 'Not Provided'}
🏠 *Address:* {room.address}
📍 *Google Maps:* {room.google_map_link or 'No link available'}

_Please call the owner before visiting. Let them know ApnaRoom sent you!_"""

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone_number,
        "type": "text",
        "text": {"body": reply_text}
    }
    requests.post(url, headers=headers, json=payload)