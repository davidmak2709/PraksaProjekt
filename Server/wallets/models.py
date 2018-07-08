from django.db import models
from users import models as users_models

class Wallet(models.Model):
	user = models.ForeignKey(users_models.CustomUser, on_delete=models.CASCADE)
	balance = models.FloatField()
	currency = models.CharField(max_length=5)
	name = models.CharField(max_length=50, null=True)

	def __str__(self):
		return self.balance
