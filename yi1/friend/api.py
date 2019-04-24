import datetime
from django.db.models import Q
from common import errors
from friend.logics import upload_message_to_oss
from lib.http import render_json
from friend.models import Friend, Chat, Friend_Apply
from user.models import User


def get_friend_list(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    friends = Friend.objects.filter(uid=uid)
    print(uid)
    # 好友列表为空 4009
    if not friends.exists():
        raise errors.FRIEND_EMPTY('no friend')

    friend_list = []
    for friend in friends:
        fid = friend.fid
        chat_message = Chat.objects.filter(sid=fid, gid=uid, is_read=0)
        if chat_message.exists():
            no_read = True
        else:
            no_read = False

        a_friend = User.objects.get(id=fid)
        nickname = a_friend.nickname
        avatar = a_friend.avatar
        friend_list.append({'fid':fid, 'nickname':nickname, 'avatar':avatar, 'no_read':no_read})

    return render_json({'friends':friend_list})


def get_all_chat_message(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    gid = request.GET.get('gid')
    f_user = User.objects.filter(id=gid)
    if not f_user.exists():
        raise errors.NO_THIS_USER('not this friend')

    f_nickname = f_user.first().nickname
    # 可以在好友列表中添加好友标识
    if not f_nickname:
        f_nickname = '匿名好友'

    all_mes = Chat.objects.filter(sid__in=(uid, gid)).order_by('stime')
    # 没有聊天记录  4010
    if not all_mes.exists():
        raise errors.NO_CHAT_MESSAGE('no chat message')

    mes_list = []
    for mes in all_mes:
        id = mes.id
        sid = mes.sid
        gid = mes.gid
        uid = int(uid)
        avatar = "#"
        if uid == sid:
            if mes.s_delete == 1:
                continue
            avatar = User.objects.filter(id=uid).first().avatar
        if uid == gid:
            if mes.g_delete == 1:
                continue
            mes.is_read = 1
            mes.save()
            avatar = User.objects.filter(id=gid).first().avatar

        message = mes.message
        stime = mes.stime

        mes_list.append({'mid': id, 'sid': sid, 'gid': gid, 'avatar': avatar, 'message': message, 'stime': str(stime)})

        if not mes_list:
            raise errors.NO_CHAT_MESSAGE('no chat message')

    return render_json({'f_nickname': f_nickname, 'mes_list': mes_list})


# 聊天页面, 必须建立websocket连接
def send_message(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    gid = request.POST.get('gid')
    users = User.objects.filter(id=gid)
    if not users.exists():
        raise errors.NO_THIS_USER('no this user')

    message = request.POST.get('message')
    # if not message:
    #     message = request.FILES.get('message')

    if not message:
        raise errors.NO_CHAT_MESSAGE('can not send empty')

    # if not isinstance(message, str):
    #     user = Chat.objects.create(sid=uid, gid=gid)
    #     upload_message_to_oss(user, message)

    # else:
    #     chat = Chat.objects.create(sid=uid, gid=gid, message=message)
    chat = Chat.objects.create(sid=uid, gid=gid, message=message)
    avatar = User.objects.filter(id=uid).first().avatar

    return render_json({'mid': chat.id, 'avatar': avatar})


def get_message(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    sid = request.GET.get('sid')

    all_mes = Chat.objects.filter(sid=sid, gid=uid, is_read=0).order_by('-stime')
    print(all_mes)
    if not all_mes.exists():
        raise errors.NO_CHAT_MESSAGE('no new chat message')
    mes_list = []
    for mes in all_mes:
        id = mes.id
        sid = mes.sid
        gid = mes.sid
        message = mes.message
        stime = mes.stime

        mes.is_read = 1
        mes.save()
        mes_list.append({'mid': id, 'sid': sid, 'gid': gid, 'message': message, 'stime': str(stime)})

    return render_json(mes_list)


def delete_message(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    mid = request.POST.get('mid')
    if mid is not None:
        message = Chat.objects.filter(id=mid)
        if not message.exists():
            raise errors.NO_CHAT_MESSAGE('not this message')
        message = message.first()
        if uid == message.sid:
            message.s_delete = 1
            if message.g_delete == 1:
                message.delete()
            else:
                message.save()
        elif uid == message.gid:
            message.g_delete = 1
            if message.s_delete == 1:
                message.delete()
            else:
                message.save()
        else:
            raise errors.NOT_MESSAGE_PERMISSION('no permission to change this message')

    if not mid:
        fid = request.POST.get('fid')
        if not Friend.objects.filter(uid=uid, fid=fid).exists():
            raise errors.FRIEND_EMPTY('not this friend')

        chat1 = Chat.objects.filter(sid=uid, gid=fid)
        chat2 = Chat.objects.filter(sid=fid, gid=uid)

        if not chat1.exists() and not chat2.exists():
            raise errors.NO_CHAT_MESSAGE('not chat message')

        if chat1.exists():
            chat1.update(s_delete=1)
            chat = chat1.filter(g_delete=1)
            if chat.exists():
                chat.delete()
        if chat2.exists():
            chat2.update(g_delete=1)
            chat = chat1.filter(s_delete=1)
            if chat.exists():
                chat.delete()

    return render_json('delete success')


def friend_apply(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    gid = request.POST.get('gid')

    # 好友申请有误 4011
    if uid == gid:
        raise errors.FRIEND_APPLY_ERROR('can not apply self')

    if not User.objects.filter(id=gid).exists():
        raise errors.NO_THIS_USER('not user who you apply')

    if Friend.objects.filter(uid=uid, fid=gid).exists():
        raise errors.FRIEND_APPLY_ERROR('already friend')

    Friend_Apply.objects.get_or_create(aid=uid, rid=gid)
    return render_json('Waiting for an answer')


def get_all_apply(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    apply_list = Friend_Apply.objects.filter(Q(aid=uid)|Q(rid=uid))
    # 申请列表为空
    if not apply_list.exists():
        raise errors.APPLY_EMPTY('apply list empty')

    wait_read_apply = []
    for apply in apply_list:
        apply_id = apply.id
        aid = apply.aid
        rid = apply.rid
        state = apply.state
        stime = apply.stime
        a_read = apply.a_read
        r_read = apply.r_read

        if int(uid) == aid:
            is_read = a_read
            nickname = User.objects.filter(id=rid).first().nickname
            u_apply = 1
        elif int(uid) == rid:
            is_read = r_read
            nickname = User.objects.filter(id=aid).first().nickname
            u_apply = 0
        else:
            raise errors.FRIEND_APPLY_ERROR('not apply nor response')

        wait_read_apply.append({'apply_id':apply_id,
                                'nickname':nickname,
                                'state':state,
                                'stime':str(stime),
                                'is_read':is_read,
                                'u_apply':u_apply,
                                })
    return render_json({"apply_list": wait_read_apply})


def apply_read_deal(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    apply_id = request.POST.get('apply_id')
    apply = Friend_Apply.objects.filter(id=apply_id)
    if not apply.exists():
        raise errors.APPLY_EMPTY('not this apply')

    apply = apply.first()
    state=apply.state
    stime=apply.stime

    aid = apply.aid
    rid = apply.rid
    uid = int(uid)
    sender = User.objects.get(id=aid).nickname
    receiver = User.objects.get(id=rid).nickname
    if uid == aid:
        a_user=1
        if apply.state != 'wait':
            apply.delete()
        else:
            apply.a_read = 1
            apply.save()
    elif uid == rid:
        a_user = 0
        apply.r_read = 1
        apply.save()
    else:
        raise errors.FRIEND_APPLY_ERROR('not apply nor response')

    return render_json({"sender": sender, "receiver": receiver, "state": state, "stime": str(stime), "a_user": a_user, "aid":aid})


def res_friend_invite(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    apply_id = request.POST.get('apply_id')
    state = request.POST.get('state')

    f_apply = Friend_Apply.objects.filter(id=apply_id, rid=uid, state='wait')
    if not f_apply.exists():
        raise errors.FRIEND_APPLY_ERROR('not this apply')

    f_apply = f_apply.first()

    if state == 'pass':
        f_apply.state = 'pass'
        f_apply.stime = datetime.datetime.now()
        f_apply.a_read = 0
        f_apply.save()

        Friend.objects.create(uid=uid, fid=f_apply.aid)
        Friend.objects.create(uid=f_apply.aid, fid=uid)

    elif state == 'fail':
        f_apply.state = 'fail'
        f_apply.stime = datetime.datetime.now()
        f_apply.a_read = 0
        f_apply.save()

    else:
        raise errors.FRIEND_APPLY_ERROR('wrong state code')

    return render_json('add success')