from rest_framework import serializers
from .models import Patient


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Patient
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = Patient.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
