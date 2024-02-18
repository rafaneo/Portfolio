from rest_framework import serializers
from mainapp.models import User, Logs


class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = '__all__'