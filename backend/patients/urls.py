from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshSlidingView
from .views import register_view

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshSlidingView.as_view(), name='token_refresh'),
    path('register/', register_view, name='register'),
]
