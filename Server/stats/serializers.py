from rest_framework import serializers

class CategoryStatsSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=20)
    percentage_outcome = serializers.FloatField()
    percentage_income = serializers.FloatField()
