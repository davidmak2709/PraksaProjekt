from rest_framework import serializers
from . import models

class WalletSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Wallet
		fields = ('pk', 'user', 'balance', 'currency', 'name')
		read_only_fields = ('pk', 'user')

class WalletUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Wallet
		fields = ('pk', 'user', 'balance', 'currency', 'name')
		read_only_fields = ('pk', 'user', 'currency')

class TransactionSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Transaction
		fields = ('pk', 'wallet', 'name', 'date', 'amount', 'currency', 'category', 'recurring')
		read_only_fields = ('pk',)

	def validate_wallet(self, value):
		current_user = self.context['request'].user
		if value.user!=current_user:
			raise serializers.ValidationError("User doesn't own this wallet")
		return value

	#def validate_date(self, value):
		#pass
		# TODO: check date?

class TransactionUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Transaction
		fields = ('pk', 'wallet', 'name', 'date', 'amount', 'currency', 'category', 'recurring')
		read_only_fields = ('pk', 'wallet', 'amount', 'currency')
