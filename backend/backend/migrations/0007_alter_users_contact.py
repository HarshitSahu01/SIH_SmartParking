# Generated by Django 5.1.3 on 2024-12-12 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_users_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='contact',
            field=models.CharField(default='', max_length=20),
        ),
    ]
