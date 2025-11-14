from django.urls import path
from .views import (
    PatientAppointmentListCreate, PatientAppointmentDetail,
    PatientPrescriptionList, PatientRecordList
)

urlpatterns = [
    path('appointments/', PatientAppointmentListCreate.as_view(), name='appointments'),
    path('appointments/<uuid:pk>/', PatientAppointmentDetail.as_view(), name='appointment-detail'),
    path('prescriptions/', PatientPrescriptionList.as_view(), name='prescriptions'),
    path('records/', PatientRecordList.as_view(), name='records'),
]
