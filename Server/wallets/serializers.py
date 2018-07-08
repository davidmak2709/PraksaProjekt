from rest_framework import serializers
from . import models

class WalletSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Wallet
		fields = ('pk', 'user', 'balance', 'currency', 'name')
		read_only_fields = ('pk', 'user')
