class LogicError(Exception):
    name = None
    code = None

    def __init__(self, data):
        self.data = data


def gen_logicerror(name, code):
    return type(name, (LogicError,), {'code': code})


# 请求方式错误
REQUEST_ERROR = gen_logicerror('REQUEST_ERROR', 4001)
# 用户注册错误
REGISTER_ERROR = gen_logicerror('REGISTER_ERROR', 4002)
# 用户名和密码错误
LOGIN_ERROR = gen_logicerror('LOGIN_ERROR', 4003)
# 用户未登录
USER_NOT_LOGIN = gen_logicerror('USER_NOT_LOGIN', 4004)
# 用户不存在
NO_THIS_USER = gen_logicerror('NO_THIS_USER', 4005)
# 发表说说内容不可为空
SEND_WORDS_EMPTY = gen_logicerror('SEND_WORDS_EMPTY', 4006)
# 说说不存在
WORDS_ERROR = gen_logicerror('WORDS_ERROR', 4007)
# 匿名信息, 不显示用户信息
ANONYMOUS_ERROR = gen_logicerror('ANONYMOUS_ERROR', 4008)
# 好友列表为空
FRIEND_EMPTY = gen_logicerror('FRIEND_EMPTY', 4009)
# 没有聊天记录
NO_CHAT_MESSAGE = gen_logicerror('NO_CHAT_MESSAGE', 4010)
# 好友申请有误
FRIEND_APPLY_ERROR = gen_logicerror('FRIEND_APPLY_ERROR', 4011)
# 申请列表为空
APPLY_EMPTY = gen_logicerror('APPLY_EMPTY', 4012)
# 用户已登陆
USER_ALREADY_LOGIN = gen_logicerror('USER_ALREADY_LOGIN', 4013)
# 没有操作此信息的权限
NOT_MESSAGE_PERMISSION = gen_logicerror('NOT_MESSAGE_PERMISSION', 4014)
# 认证链接已超时
VERIFY_OUT_TIME = gen_logicerror('VERIFY_OUT_TIME', 4015)