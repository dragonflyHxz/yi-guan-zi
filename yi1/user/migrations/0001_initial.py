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
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phonenum', models.CharField(max_length=20, null=True, unique=True, verbose_name='手机号')),
                ('eamil', models.EmailField(blank=True, max_length=254, null=True, unique=True, verbose_name='邮箱')),
                ('nickname', models.CharField(max_length=20, unique=True, verbose_name='昵称')),
                ('password', models.CharField(max_length=20, verbose_name='密码')),
                ('avatar', models.CharField(max_length=100, verbose_name='头像')),
                ('sex', models.CharField(choices=[('male', '男'), ('female', '女'), ('secret', '保密')], default='secret', max_length=20, verbose_name='性别')),
                ('birthday', models.DateTimeField(blank=True, null=True, verbose_name='生日')),
                ('location', models.CharField(blank=True, max_length=20, null=True, verbose_name='常居地')),
            ],
            bases=(models.Model, lib.orm.ModelMixin),
        ),
    ]
