from django.db.models import Q
from dwebsocket.decorators import accept_websocket
from common import errors
from friend.models import Chat, Friend_Apply, Friend
from lib.http import render_json
from social.models import Words, Praise
from user.models import User

ws_conn_users = {}


@accept_websocket
def information(request):
    uid = request.COOKIES.get('uid')
    gid = request.GET.get('gid')

    # 判断是不是websocket连接
    if not request.is_websocket():
        # 如果是普通的http方法, 视为浏览器不支持websock连接，改用ajax轮询解决
        raise errors.REQUEST_ERROR("no websocket")

    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    if uid not in ws_conn_users:
        ws_conn_users[uid] = request.websocket

    for message in ws_conn_users[uid]:

        # 需要前端发信息时传送一个标志, 根据此标志，后端返回相应的执行码
        if message == b's_s':
            for i, online_user in ws_conn_users.items():
                if i != uid:
                    online_user.send('40000')
        elif message == b'a_f':
            if gid in ws_conn_users:
                ws_conn_users[gid].send('40001')
        elif message == b'f_c':
            if gid in ws_conn_users:
                re_mes = '40002=' + str(uid)
                ws_conn_users[gid].send(re_mes)

        elif not message:
            del ws_conn_users[uid]
            print('connect close')
        else:
            ws_conn_users[uid].send('error mark')


def no_read_message(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')
    chat = False
    apply = False
    if Chat.objects.filter(gid=uid, is_read=False).exists():
        chat = True

    if Friend_Apply.objects.filter(Q(rid=uid, r_read=0) | Q(aid=uid, a_read=0)).exists():
        apply = True

    return render_json({'chat': chat, 'apply': apply})


def send_words(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')

    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    message = request.POST.get('message')
    anonymous = request.POST.get('anonymous')

    if anonymous != 1:
        anonymous = 0

    if not message:
        raise errors.SEND_WORDS_EMPTY('empty message')

    Words.objects.create(uid=uid, message=message, anonymous=anonymous)
    return render_json('commit success')


def get_all_words(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    # 获取所有说说
    all_mes = Words.objects.all().order_by('-stime')

    mes_list = []
    for mes in all_mes:
        uid = mes.uid
        user = User.objects.values('nickname', 'avatar').get(id=uid)
        user['message'] = mes.message
        user['stime'] = str(mes.stime)
        user['praise'] = mes.praise
        user['mid'] = mes.id
        user['uid'] = mes.uid
        mes_list.append(user)
    return render_json(mes_list)


def like(request):
    if not request.method == 'POST':
        raise errors.REQUEST_ERROR('request method error')

    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    mid = request.POST.get('mid')
    mes = Words.objects.filter(id=mid)
    print(mid)
    # 说说不存在, 4007
    if not mes.exists():
        raise errors.WORDS_ERROR('words not exist')

    mes = mes.first()

    praise = Praise.objects.filter(sid=uid, mid=mid)
    if praise.exists():
        mes.praise -= 1
        mes.save()
        praise.delete()
    else:
        mes.praise += 1
        mes.save()
        Praise.objects.create(sid=uid, mid=mid)

    return render_json({'praise': mes.praise})


def check_mid_anonymous(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')
    mid = request.GET.get('mid')
    words = Words.objects.filter(id=mid)
    if not words.exists():
        raise errors.WORDS_ERROR('words not exist')

    word = words.first()
    sid = word.uid

    # 匿名信息, 不显示用户信息 4008
    if word.anonymous == 1 and sid != uid:
        raise errors.ANONYMOUS_ERROR('anonymous words')
    return render_json('no anonymous')


def get_person_by_words(request):
    uid = request.COOKIES.get('uid')
    if not uid:
        raise errors.USER_NOT_LOGIN('user not login')

    mid = request.GET.get('mid')
    words = Words.objects.filter(id=mid)

    if not words.exists():
        raise errors.WORDS_ERROR('words not exist')

    word = words.first()
    sid = word.uid

    # 匿名信息, 不显示用户信息 4008
    if word.anonymous == 1 and sid != uid:
        raise errors.ANONYMOUS_ERROR('anonymous words')

    users = User.objects.filter(id=word.uid)
    if not users.exists():
        raise errors.NO_THIS_USER('not this user')

    user = users.first()
    all_words = Words.objects.filter(uid=user.id).order_by('-stime')

    words_list = []

    for mes in all_words:
        word_dict = {}
        if mes.anonymous == 1 and mes.uid != uid:
            continue
        word_dict['message'] = mes.message
        word_dict['stime'] = str(mes.stime)
        word_dict['praise'] = mes.praise
        word_dict['mid'] = mes.id
        words_list.append(word_dict)

    person_dict = {'person': {'pid': user.id, 'nickname': user.nickname, 'avatar': user.avatar, 'sex': user.sex},
                   'words_list': words_list}
    return render_json(person_dict)
