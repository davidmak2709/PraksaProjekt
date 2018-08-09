from rest_framework import serializers

class CategoryStatsSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=20)
    percentage = serializers.FloatField()
    type = serializers.CharField(max_length=5)
