# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-04-19 01:52
from __future__ import unicode_literals

from django.db import migrations, models
import lib.orm


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sid', models.IntegerField()),
                ('gid', models.IntegerField()),
                ('message', models.TextField()),
                ('stime', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.IntegerField(choices=[(0, 'no'), (1, 'yes')], default=0)),
            ],
            bases=(models.Model, lib.orm.ModelMixin),
        ),
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.IntegerField()),
                ('fid', models.IntegerField()),
            ],
            bases=(models.Model, lib.orm.ModelMixin),
        ),
        migrations.CreateModel(
            name='Friend_Apply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aid', models.IntegerField()),
                ('rid', models.IntegerField()),
                ('state', models.CharField(choices=[('wait', '等待回应'), ('pass', '通过'), ('fail', '不通过')], default='wait', max_length=5)),
                ('stime', models.DateTimeField(auto_now_add=True)),
            ],
            bases=(models.Model, lib.orm.ModelMixin),
        ),
    ]
