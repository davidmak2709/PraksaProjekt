# Generated by Django 2.0 on 2018-07-08 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wallet',
            name='name',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
