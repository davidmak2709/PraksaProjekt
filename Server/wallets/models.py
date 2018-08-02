from django.db import models
from datetime import date
from currency_converter import CurrencyConverter
from users import models as users_models

EURO = 'EUR'
BRITISH_POUND = 'GBP'
CROATIAN_KUNA = 'HRK'
UNITED_STATES_DOLLAR = 'USD'
SWISS_FRANC = 'CHF'
CURRENCY_CHOICES = (
	(EURO, 'Euro'),
	(BRITISH_POUND, 'British pound'),
	(CROATIAN_KUNA, 'Croatian kuna'),
	(UNITED_STATES_DOLLAR, 'United States dollar'),
	(SWISS_FRANC, 'Swiss franc'),
)

class Wallet(models.Model):
	user = models.ForeignKey(users_models.CustomUser, on_delete=models.CASCADE)
	balance = models.FloatField()
	currency = models.CharField(max_length=5, choices=CURRENCY_CHOICES)
	name = models.CharField(max_length=50, null=True)

	def __str__(self):
		return 'Wallet: {} {} {} {}'.format(self.user, self.balance, self.currency, self.name)

class Transaction(models.Model):
	PAYCHECK = 'paycheck'
	GASOLINE = 'gasoline'
	CHARITY = 'charity'
	CLOTHING = 'clothing'
	GROCERIES = 'groceries'
	GIFTS = 'gifts'
	HEALTHCARE = 'healthcare'
	HOUSEHOLD = 'household'
	INSURANCE = 'insurance'
	LEISURE_HOBBIES = 'leisure_hobbies'
	UTILITIES = 'utilities'
	VACATION = 'vacation'
	OTHER = 'other'
	TRANSACTION_CHOICES = (
		(PAYCHECK, 'Paycheck'),
		(GASOLINE, 'Car gas'),
		(CHARITY, 'Charity (e.g. donations)'),
		(CLOTHING, 'Clothes'),
		(GROCERIES, 'Groceries'),
		(GIFTS, 'Gifts'),
		(HEALTHCARE, 'Healthcare'),
		(HOUSEHOLD, 'Household (e.g. rennovations)'),
		(INSURANCE, 'Insurance costs'),
		(LEISURE_HOBBIES, 'Leisure and hobbies'),
		(UTILITIES, 'Utilities (e.g. electricity bills)'),
		(VACATION, 'Vacation'),
		(OTHER, 'Other'),
	)
	wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	date = models.DateField(default=date.today)
	amount = models.FloatField()
	currency = models.CharField(max_length=5, choices=CURRENCY_CHOICES)
	category = models.CharField(max_length=20, choices=TRANSACTION_CHOICES)
	recurring = models.BooleanField(default=False)

	def __str__(self):
		return 'Transaction: {} {} {} {}'.format(self.wallet, self.category, self.amount, self.currency)

	def save(self, *args, **kwargs):
		if not Transaction.objects.filter(pk=self.pk).exists():
			wallet = Wallet.objects.get(pk=self.wallet.pk)
			if wallet.currency!=self.currency:
				c = CurrencyConverter()
				converted_amount = c.convert(self.amount, self.currency, wallet.currency)
			else:
				converted_amount = self.amount
			wallet.balance += converted_amount
			wallet.save()
		models.Model.save(self, *args, **kwargs)

	def delete(self, *args, **kwargs):
		wallet = Wallet.objects.get(pk=self.wallet.pk)
		if wallet.currency!=self.currency:
			c = CurrencyConverter()
			converted_amount = c.convert(self.amount, self.currency, wallet.currency)
		else:
			converted_amount = self.amount
		wallet.balance -= converted_amount
		wallet.save()
		models.Model.delete(self, *args, **kwargs)
