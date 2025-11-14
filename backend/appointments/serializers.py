from rest_framework import serializers
from .models import Appointment, Prescription, MedicalRecord
from django.conf import settings

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id','doctor_name','department','date','time','status','created_at']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id','title','content','issued_at']

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id','title','notes','file','created_at']
