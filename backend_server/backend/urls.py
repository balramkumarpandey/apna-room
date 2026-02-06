from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from api.views import RoomViewSet, TenantInquiryCreateView, LandlordInquiryCreateView, ColonyListView

from django.urls import re_path
from django.views.static import serve

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/', include(router.urls)), 
    
    path('api/inquire/tenant/', TenantInquiryCreateView.as_view(), name='tenant-inquiry'),
    path('api/inquire/landlord/', LandlordInquiryCreateView.as_view(), name='landlord-inquiry'),
    path('api/colonies/', ColonyListView.as_view(), name='colony-list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]