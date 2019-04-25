from django.db import models
from lib.orm import ModelMixin


# 好友表
class Friend(models.Model, ModelMixin):
    uid = models.IntegerField()
    fid = models.IntegerField()


# 存储好友间的聊天记录
class Chat(models.Model, ModelMixin):
    IS_READ =(
        (0, 'no'),
        (1, 'yes')
    )
    sid = models.IntegerField()
    gid = models.IntegerField()
    message = models.TextField(null=False)
    stime = models.DateTimeField(auto_now_add=True)
    is_read = models.IntegerField(default=0, choices=IS_READ)
    s_delete = models.IntegerField(default=0, choices=IS_READ)
    g_delete = models.IntegerField(default=0, choices=IS_READ)


# 存储好友申请信息
class Friend_Apply(models.Model, ModelMixin):
    STATE = (
        ('wait', '等待回应'),
        ('pass', '通过'),
        ('fail', '不通过')
    )
    aid = models.IntegerField()
    rid = models.IntegerField()
    state = models.CharField(max_length=5, default='wait', choices=STATE)
    stime = models.DateTimeField(auto_now_add=True)
    IS_READ = (
        (0, 'no'),
        (1, 'yes')
    )
    a_read = models.IntegerField(default=0, choices=IS_READ)
    r_read = models.IntegerField(default=0, choices=IS_READ)
