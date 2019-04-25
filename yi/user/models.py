from django.db import models
from lib.orm import ModelMixin


class User(models.Model, ModelMixin):
    SEX = (
        ('male', '男'),
        ('female', '女'),
        ('secret', '保密')
    )

    phonenum = models.CharField(max_length=20, unique=True, verbose_name="手机号", null=True)
    email = models.EmailField(verbose_name='邮箱', unique=True, null=True, blank=True)
    nickname = models.CharField(max_length=20, verbose_name="昵称", unique=True)
    password = models.CharField(max_length=20, verbose_name="密码", null=False)
    avatar = models.CharField(max_length=100, verbose_name="头像")
    sex = models.CharField(max_length=20, choices=SEX, verbose_name="性别", default='secret')
    birthday = models.DateTimeField(verbose_name="生日", null=True, blank=True)
    location = models.CharField(max_length=20, verbose_name="常居地", null=True, blank=True)

