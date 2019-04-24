from uuid import uuid4
from django.core.cache import cache
from common import errors
from lib.http import render_json
from user.logics import upload_avatar_to_oss, send_email
from user.models import User


def register(request):
    # 如果不是post请求, 错误码4001
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if uid:
        raise errors.USER_ALREADY_LOGIN('user already login')

    nickname = request.POST.get('nickname')
    password = request.POST.get('password')
    re_password = request.POST.get('re_password')

    #用户名或密码为空, 注册错误, 错误码4002
    if not password or not nickname:
        raise errors.REGISTER_ERROR('no empty value')

    users = User.objects.filter(nickname=nickname)
    # 用户已存在,注册错误, 错误码4002
    if users.exists():
        raise errors.REGISTER_ERROR('username already exist')

    # 两次输入的密码不一致
    if password != re_password:
        raise errors.REGISTER_ERROR('incorrect password')

    user = User.objects.create(nickname=nickname, password=password)
    # request.session['uid'] = user.id
    # return render_json(user.to_string())

    response = render_json({'uid': user.id})
    response.set_cookie('uid', user.id)
    return response


def login(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if uid:
        raise errors.USER_ALREADY_LOGIN('user already login')

    nickname = request.POST.get('nickname')
    password = request.POST.get('password')
    users = User.objects.filter(nickname=nickname, password=password)
    if users.exists():
        user = users.first()

        response = render_json({'uid': user.id})
        response.set_cookie('uid', user.id)
        return response
    # 用户名和密码错误 4003
    raise errors.LOGIN_ERROR('nickname or password error')


def logout(request):
    uid = request.COOKIES.get('uid')

    # 用户未登录 4004
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')
    response = render_json('logout success')
    response.delete_cookie('uid')
    return response


def get_profile(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    users = User.objects.values('nickname', 'avatar', 'sex', 'birthday').filter(id=uid)

    print(request.META)
    # 用户不存在 4005
    if not users.exists():
        raise errors.NO_THIS_USER('no this user')

    user = users.first()
    user["birthday"] = str(user["birthday"])
    return render_json({"user": user})


def set_profile(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    users = User.objects.filter(id=uid)
    # 用户不存在 4005
    if not users.exists():
        raise errors.NO_THIS_USER('no this user')

    user = users.first()

    nickname = request.POST.get('nickname')
    avatar = request.FILES.get('avatar')
    sex = request.POST.get('sex')
    birthday = request.POST.get('birthday')

    if user.nickname != nickname and User.objects.filter(nickname=nickname).exists():
        raise errors.FRIEND_APPLY_ERROR('nickname alread exist')

    if sex not in('female', 'male', 'secret'):
        raise errors.FRIEND_APPLY_ERROR('sex no such option')

    user.nickname = nickname

    user.sex = sex
    user.birthday = birthday

    if avatar:
        upload_avatar_to_oss(user, avatar)
    else:
        user.save()
    return render_json('set success')


def email_register(request):
    # 如果不是post请求, 错误码4001
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if uid:
        raise errors.USER_ALREADY_LOGIN('user already login')

    email = request.POST.get('email')
    password = request.POST.get('password')
    re_password = request.POST.get('re_password')

    if not password or not email:
        raise errors.REGISTER_ERROR('no empty value')

    if User.objects.filter(email=email).exists():
        raise errors.REGISTER_ERROR('username already exist')

    if password != re_password:
        raise errors.REGISTER_ERROR('incorrect password')

    token = str(uuid4())
    cache.set(token, {'email': email, 'password': password}, 180)
    send_email(email, token)

    print(token)
    return render_json('email send')


def email_verify(request):
    token = request.GET.get('token')
    email_register = cache.get(token)
    if not email_register:
        raise errors.VERIFY_OUT_TIME('verify out time')

    email = email_register['email']
    password = email_register['password']
    User.objects.get_or_create(email=email, password=password)
    return render_json('register succsee')
