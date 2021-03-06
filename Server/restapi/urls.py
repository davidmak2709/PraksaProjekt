from django.urls import include, path

urlpatterns = [
	path('users/', include('users.urls')),
	path('wallets/', include('wallets.urls')),
	path('stats/', include('stats.urls')),
	path('rest-auth/', include('rest_auth.urls')),
	path('rest-auth/registration/', include('rest_auth.registration.urls')),
]
