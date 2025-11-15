from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import datetime
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

class PatientLastVisit(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        last_visit = (
            Appointment.objects.filter(patient=request.user, date__lt=datetime.date.today())
            .order_by('-date', '-time')
            .first()
        )
        if last_visit:
            serializer = AppointmentSerializer(last_visit)
            return Response(serializer.data)
        return Response(None, status=status.HTTP_200_OK)
    
class PatientRecordCount(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = request.user.records.count()
        return Response({"count": count})