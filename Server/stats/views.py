from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from currency_converter import CurrencyConverter
from wallets import models
from . import serializers

class CategoryStatsView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    @method_decorator(cache_page(60*60*24))
    @method_decorator(vary_on_cookie)
    def get(self, request, format=None):
        current_user = self.request.user
        if request.GET.get('type', 'out')=='out':
            all_transactions = models.Transaction.objects.filter(wallet__in=models.Wallet.objects.filter(user=current_user.pk), amount__lte=0)
        elif request.GET.get('type', 'out')=='in':
            all_transactions = models.Transaction.objects.filter(wallet__in=models.Wallet.objects.filter(user=current_user.pk), amount__gte=0)

        cumulative, cumulative_category = 0, 0
        for transaction in all_transactions:
            if transaction.currency!='HRK':
                c = CurrencyConverter()
                converted_amount = c.convert(transaction.amount, transaction.currency, 'HRK')
            else:
                converted_amount = transaction.amount
            cumulative += converted_amount
            if transaction.category==request.GET.get('category', ''):
                cumulative_category += converted_amount

        if cumulative_category!=0:
            percentage = (cumulative_category/cumulative)*100
        else:
            percentage = 0
        data = [{'category': request.GET.get('category', ''), 'percentage': percentage, 'type': request.GET.get('type', 'out')}]
        results = serializers.CategoryStatsSerializer(data, many=True).data
        return Response(results)
