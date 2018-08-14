from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.db.models import Sum
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
        CHOSEN_CURRENCY = 'HRK'
        current_user = self.request.user
        cumulative_lte, cumulative_gte = 0, 0
        cumulative_cat_lte, cumulative_cat_gte = 0, 0
        c = CurrencyConverter()
        all_sum_lte = models.Transaction.objects.filter(
            wallet__in=models.Wallet.objects.filter(user=current_user.pk),
            amount__lte=0
            ).values('currency').annotate(Sum('amount'))
        all_sum_gte = models.Transaction.objects.filter(
            wallet__in=models.Wallet.objects.filter(user=current_user.pk),
            amount__gte=0
            ).values('currency').annotate(Sum('amount'))
        cat_sum_lte = models.Transaction.objects.filter(
            wallet__in=models.Wallet.objects.filter(user=current_user.pk),
            amount__lte=0,
            category=request.GET.get('category', '')
            ).values('currency').annotate(Sum('amount'))
        cat_sum_gte = models.Transaction.objects.filter(
            wallet__in=models.Wallet.objects.filter(user=current_user.pk),
            amount__gte=0,
            category=request.GET.get('category', '')
            ).values('currency').annotate(Sum('amount'))

        for currency_sum in all_sum_lte:
            if currency_sum['currency']!=CHOSEN_CURRENCY:
                currency_sum['amount__sum'] = c.convert(currency_sum['amount__sum'], currency_sum['currency'], CHOSEN_CURRENCY)
            cumulative_lte += currency_sum['amount__sum']
        for currency_sum in all_sum_gte:
            if currency_sum['currency']!=CHOSEN_CURRENCY:
                currency_sum['amount__sum'] = c.convert(currency_sum['amount__sum'], currency_sum['currency'], CHOSEN_CURRENCY)
            cumulative_gte += currency_sum['amount__sum']
        for currency_sum in cat_sum_lte:
            if currency_sum['currency']!=CHOSEN_CURRENCY:
                currency_sum['amount__sum'] = c.convert(currency_sum['amount__sum'], currency_sum['currency'], CHOSEN_CURRENCY)
            cumulative_cat_lte += currency_sum['amount__sum']
        for currency_sum in cat_sum_gte:
            if currency_sum['currency']!=CHOSEN_CURRENCY:
                currency_sum['amount__sum'] = c.convert(currency_sum['amount__sum'], currency_sum['currency'], CHOSEN_CURRENCY)
            cumulative_cat_gte += currency_sum['amount__sum']

        if cumulative_cat_lte==0:
            percentage_lte = 0
        else:
            percentage_lte = (cumulative_cat_lte/cumulative_lte)*100
        if cumulative_cat_gte==0:
            percentage_gte = 0
        else:
            percentage_gte = (cumulative_cat_gte/cumulative_gte)*100

        data = [{'category': request.GET.get('category', ''), 'percentage_outcome': percentage_lte, 'percentage_income': percentage_gte}]
        results = serializers.CategoryStatsSerializer(data, many=True).data
        return Response(results)
