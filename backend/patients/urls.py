from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_view, patient_profile_view, PatientUpdateView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_view, name='register'),
    path('me/', patient_profile_view, name='patient_profile'),
    path('me/update/', PatientUpdateView.as_view(), name='patient_update'),
]
