# Generated by Django 4.1.3 on 2023-12-10 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yamod', '0010_movie_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='rating',
            field=models.FloatField(null=True),
        ),
    ]
