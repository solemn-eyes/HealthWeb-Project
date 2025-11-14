from django.db import models
from django.conf import settings
import uuid

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending','Pending'), ('confirmed','Confirmed'), ('cancelled','Cancelled')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor_name = models.CharField(max_length=120, blank=True)
    department = models.CharField(max_length=120, blank=True)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date','-time']

    def __str__(self):
        return f"{self.patient} - {self.date} {self.time}"

class Prescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='prescriptions')
    title = models.CharField(max_length=200)
    content = models.TextField()
    issued_at = models.DateTimeField(auto_now_add=True)

class MedicalRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='records')
    title = models.CharField(max_length=200)
    notes = models.TextField()
    file = models.FileField(upload_to='records/', null=True, blank=True)  # optional
    created_at = models.DateTimeField(auto_now_add=True)
