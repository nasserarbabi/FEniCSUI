# Generated by Django 3.0.6 on 2020-05-27 04:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
        ('AnalysesHub', '0002_auto_20200519_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='DockerLogs',
            fields=[
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='dashboard.projects')),
                ('log', models.TextField()),
            ],
        ),
    ]