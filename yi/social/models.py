from django.db import models
from lib.orm import ModelMixin


# 用户发布的说说
class Words(models.Model, ModelMixin):
    ANONYMOUS = (
        (0, 'no'),
        (1, 'yes')
    )
    uid = models.IntegerField(null=False)
    message = models.TextField(null=False)
    praise = models.IntegerField(default=0)
    stime = models.DateTimeField(auto_now_add=True)
    anonymous = models.IntegerField(default=0, choices=ANONYMOUS)


# 谁对谁点赞，被点赞的说说
class Praise(models.Model, ModelMixin):
    sid = models.IntegerField()
    mid = models.IntegerField()
    stime = models.DateTimeField(auto_now_add=True)