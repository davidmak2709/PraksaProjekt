from django_filters import rest_framework as filters
from .models import Transaction

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass

class TransactionFilter(filters.FilterSet):
    date = filters.DateFromToRangeFilter()
    wallet = NumberInFilter()
    name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Transaction
        fields = ['date', 'category', 'wallet', 'name']
