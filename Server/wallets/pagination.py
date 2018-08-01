from rest_framework.pagination import PageNumberPagination

class TransactionPageNumberPagination(PageNumberPagination):
    page_size = 10
