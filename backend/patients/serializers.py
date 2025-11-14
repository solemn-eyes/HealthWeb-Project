import re
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Patient


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long."
    )

    class Meta:
        model = Patient
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate_username(self, value):
        """Validate username format and uniqueness"""
        if not value:
            raise serializers.ValidationError("Username is required.")
        
        # Check length
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if len(value) > 30:
            raise serializers.ValidationError("Username must be no more than 30 characters long.")
        
        # Check allowed characters: letters, numbers, underscores, hyphens, dots
        # Username can contain: a-z, A-Z, 0-9, _, -, .
        if not re.match(r'^[a-zA-Z0-9._-]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, underscores, hyphens, and dots."
            )
        
        # Cannot start or end with special characters
        if value.startswith(('.', '_', '-')):
            raise serializers.ValidationError("Username cannot start with a dot, underscore, or hyphen.")
        if value.endswith(('.', '_', '-')):
            raise serializers.ValidationError("Username cannot end with a dot, underscore, or hyphen.")
        
        # Check for consecutive special characters
        if re.search(r'[._-]{2,}', value):
            raise serializers.ValidationError("Username cannot contain consecutive special characters.")
        
        # Check uniqueness
        if Patient.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        
        return value

    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        # Normalize email to lowercase
        value = value.lower().strip()
        
        # Use Django's email validator
        email_validator = EmailValidator()
        try:
            email_validator(value)
        except Exception:
            raise serializers.ValidationError("Please enter a valid email address.")
        
        # Check uniqueness
        if Patient.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return value

    def validate_password(self, value):
        """Validate password strength"""
        if not value:
            raise serializers.ValidationError("Password is required.")
        
        # Check minimum length
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        # Use Django's password validators (if configured)
        try:
            validate_password(value)
        except DjangoValidationError as e:
            # Convert Django ValidationError to a readable message
            error_messages = []
            for error in e.messages:
                error_messages.append(error)
            raise serializers.ValidationError(error_messages)
        
        return value

    def create(self, validated_data):
        try:
            user = Patient.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=validated_data['password']
            )
            return user
        except Exception as e:
            # Handle specific database errors
            error_message = str(e)
            if 'UNIQUE constraint' in error_message or 'duplicate key' in error_message.lower():
                if 'username' in error_message.lower():
                    raise serializers.ValidationError({"username": ["A user with this username already exists."]})
                elif 'email' in error_message.lower():
                    raise serializers.ValidationError({"email": ["A user with this email already exists."]})
            raise serializers.ValidationError(f"Error creating user: {error_message}")
