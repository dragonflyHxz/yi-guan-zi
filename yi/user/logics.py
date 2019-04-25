import os
from urllib.parse import urljoin
import oss2

import smtplib
from email.mime.text import MIMEText

from yi import config


def upload_avatar_to_server(uid, avatar):
    img_type = os.path.splitext(avatar.name)[1]
    if img_type not in['.png', '.jpg', '.jpeg', '.gif', 'bmp']:
        return False

    file_name = 'avatar-%s'%uid + img_type

    # save_path = ''
    # with open(save_path, 'wb') as fp:
    #     for chunk in avatar.chunks():
    #         fp.write(chunk)
    return file_name


def upload_avatar_to_oss(user, avatar):

    file_name = upload_avatar_to_server(user.id, avatar)
    if not file_name:
        user.save()
        return

    # 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
    auth = oss2.Auth(config.ACCESSKEYID,config.ACCESSSECRET)
    # Endpoint以杭州为例，其它Region请按实际情况填写。
    bucket = oss2.Bucket(auth, config.ALI_OSS_PATH, config.BUCKETNAME)
    old_avatar = user.avatar

    if old_avatar:
        old_avatar = old_avatar.split("/")[-1]
        bucket.delete_object(old_avatar)


    bucket.put_object(file_name, avatar)
    avatar_url = urljoin(config.IMG_PATH, file_name)
    user.avatar = avatar_url
    user.save()


def send_email(email, token):
    # 第三方 SMTP 服务
    mail_server = config.MAIL_SERVER  # 设置服务器
    mail_user = config.MAIL_USERNAME  # 用户名
    mail_pass = config.MAIL_PASSWORD  # 口令

    sender = config.MAIL_USERNAME
    receivers = [email]  # 接收邮件，可设置为你的QQ邮箱或者其他邮箱

    mes = '''
        <h2>你好，感谢您注册XX账号，请点击以下按钮完成认证，三分钟内有效</h2>
        <p><a href="http://127.0.0.1:8000/user/api/email_verify/?token=%s">点击完成验证</a></p>
    '''%token
    message = MIMEText(mes, 'html', 'utf-8')
    message['From'] = sender
    message['To'] = receivers[0]

    subject = 'YiGuan'
    message['Subject'] = subject

    smtpObj = smtplib.SMTP()
    smtpObj.connect(mail_server, 25)  # 25 为 SMTP 端口号
    smtpObj.login(mail_user, mail_pass)
    smtpObj.sendmail(sender, receivers, message.as_string())
    smtpObj.quit()
    print("邮件发送成功")