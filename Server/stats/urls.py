from django.urls import include, path

from . import views

urlpatterns = [
	path('categories/', views.CategoryStatsView.as_view()),
]
