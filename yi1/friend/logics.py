import os
from urllib.parse import urljoin
import oss2
from yi import config


def upload_message_to_server(uid, message):

    file_name = 'message-%s'%uid + os.path.splitext(message.name)[1]

    # save_path = ''
    # with open(save_path, 'wb') as fp:
    #     for chunk in message.chunks():
    #         fp.write(chunk)
    return file_name


def upload_message_to_oss(user, message):

    file_name = upload_message_to_server(user.id, message)

    # 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
    auth = oss2.Auth(config.ACCESSKEYID,config.ACCESSSECRET)
    # Endpoint以杭州为例，其它Region请按实际情况填写。
    bucket = oss2.Bucket(auth, config.ALI_OSS_PATH , config.BUCKETNAME)

    bucket.put_object(file_name, message)

    message_url = urljoin(config.ALI_OSS_PATH, file_name)
    user.message = message_url
    user.save()
