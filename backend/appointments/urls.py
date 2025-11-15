from django.urls import path
from .views import (
    PatientAppointmentListCreate, PatientAppointmentDetail,
    PatientPrescriptionList, PatientRecordList, PatientLastVisit, PatientRecordCount
)

urlpatterns = [
    path('appointments/', PatientAppointmentListCreate.as_view(), name='appointments'),
    path('appointments/<uuid:pk>/', PatientAppointmentDetail.as_view(), name='appointment-detail'),
    path('prescriptions/', PatientPrescriptionList.as_view(), name='prescriptions'),
    path('records/', PatientRecordList.as_view(), name='records'),
    path('last-visit/', PatientLastVisit.as_view(), name='last-visit'),
    path('record-count/', PatientRecordCount.as_view(), name='record-count'),
]
