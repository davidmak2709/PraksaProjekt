from django_cron import CronJobBase, Schedule
from datetime import date, timedelta
from wallets.models import Transaction

class RecurringTransactionCronJob(CronJobBase):
    RUN_AT_TIMES = ['03:30',]

    schedule = Schedule(run_at_times=RUN_AT_TIMES)
    code = 'cron.RecurringTransactionCronJob'

    def do(self):
        recurring_transactions = Transaction.objects.filter(date=date.today()+timedelta(-30), recurring=True)

        for transaction in recurring_transactions:
            new_transaction = Transaction(wallet=transaction.wallet,
                                          date=date.today(),
                                          name=transaction.name,
                                          amount=transaction.amount,
                                          currency=transaction.currency,
                                          category=transaction.category,
                                          recurring=transaction.recurring)
            new_transaction.save()
            print('Successfully added a copy of '+str(transaction.pk)+' on '+str(date.today()))
        print('No recurring transactions on '+str(date.today()))
