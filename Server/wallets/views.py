from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .filters import TransactionFilter
from . import models
from . import serializers
from . import pagination

class CreateWalletView(generics.CreateAPIView):
	serializer_class = serializers.WalletSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

	def perform_create(self, serializer):
		current_user = self.request.user
		serializer.save(user=current_user)

class WalletListView(generics.ListAPIView):
	serializer_class = serializers.WalletSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

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

class CreateTransactionView(generics.CreateAPIView):
	serializer_class = serializers.TransactionSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class TransactionListView(generics.ListAPIView):
	serializer_class = serializers.TransactionSerializer
	permission_classes = (permissions.IsAuthenticated,)
	pagination_class = pagination.TransactionPageNumberPagination
	filter_backends = (filters.DjangoFilterBackend,)
	filterset_class = TransactionFilter

	def get_queryset(self):
		current_user = self.request.user
		return models.Transaction.objects.filter(wallet__in=models.Wallet.objects.filter(user=current_user.pk))

class TransactionCategoriesView(views.APIView):
	def get(self, request):
		return Response(models.Transaction.TRANSACTION_CHOICES, status=status.HTTP_200_OK)

class CurrencyCategoriesView(views.APIView):
	def get(self, request):
		return Response(models.CURRENCY_CHOICES, status=status.HTTP_200_OK)
