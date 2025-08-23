from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('user.urls')),
    path('api/category/', include('category.urls')),
    path('api/product/', include('product.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/order/', include('order.urls')),
    path('api/banner/', include('banner.urls')),
    path('api/activity/', include('activity.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
