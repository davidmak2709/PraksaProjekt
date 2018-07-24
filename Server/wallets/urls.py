from django.urls import include, path

from . import views

urlpatterns = [
	path('create/', views.CreateWalletView.as_view()),
	path('', views.WalletListView.as_view()),
	path('<int:pk>/', views.WalletUpdateView.as_view()),
	path('transactions/create/', views.CreateTransactionView.as_view()),
]
