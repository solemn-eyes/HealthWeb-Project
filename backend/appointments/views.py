from rest_framework import generics, permissions
from .models import Appointment, Prescription, MedicalRecord
from .serializers import AppointmentSerializer, PrescriptionSerializer, MedicalRecordSerializer

class PatientAppointmentListCreate(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user).order_by('date','time')

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user, status='pending')

class PatientAppointmentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)

class PatientPrescriptionList(generics.ListAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prescription.objects.filter(patient=self.request.user).order_by('-issued_at')

class PatientRecordList(generics.ListAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalRecord.objects.filter(patient=self.request.user).order_by('-created_at')
