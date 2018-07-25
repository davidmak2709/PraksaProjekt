from django.urls import include, path

from . import views

urlpatterns = [
	path('create/', views.CreateWalletView.as_view()),
	path('', views.WalletListView.as_view()),
	path('<int:pk>/', views.WalletUpdateView.as_view()),
	path('transactions/', views.TransactionListView.as_view()),
	path('transactions/create/', views.CreateTransactionView.as_view()),
	path('transactions/categories/', views.TransactionCategoriesView.as_view()),
	path('currencies/', views.CurrencyCategoriesView.as_view()),
]
