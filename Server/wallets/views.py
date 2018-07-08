from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions
from . import models
from . import serializers

class CreateWalletView(generics.CreateAPIView):
	serializer_class = serializers.WalletSerializer
	permission_classes = (permissions.IsAuthenticated,)

	def perform_create(self, serializer):
		current_user = self.request.user
		serializer.save(user=current_user)

class WalletListView(generics.ListAPIView):
	serializer_class = serializers.WalletSerializer
	permission_classes = (permissions.IsAuthenticated,)

	def get_queryset(self):
		current_user = self.request.user
		return models.Wallet.objects.filter(user=current_user.pk)

class WalletUpdateView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = serializers.WalletSerializer
	permission_classes = (permissions.IsAuthenticated,)

	def get_object(self):
		current_user = self.request.user
		selected_wallet = self.kwargs['pk']
		obj = get_object_or_404(models.Wallet, pk=selected_wallet, user=current_user.pk)
		return obj
