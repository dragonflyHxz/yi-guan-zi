"""yi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from user import api as user_api
from social import api as social_api
from friend import api as friend_api

from page import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^user/api/register/', user_api.register),
    url(r'^user/api/login/', user_api.login),
    url(r'^user/api/logout/', user_api.logout),
    url(r'^user/api/get_profile/', user_api.get_profile),
    url(r'^user/api/set_profile/', user_api.set_profile),
    url(r'^user/api/email_register/', user_api.email_register),
    url(r'^user/api/email_verify/', user_api.email_verify),


    url(r'^social/api/information/', social_api.information),
    url(r'^social/api/no_read_message/', social_api.no_read_message),
    url(r'^social/api/send_words/', social_api.send_words),
    url(r'^social/api/get_all_words/', social_api.get_all_words),
    url(r'^social/api/like/', social_api.like),
    url(r'^social/api/check_mid_anonymous/', social_api.check_mid_anonymous),
    url(r'^social/api/get_person_by_words/', social_api.get_person_by_words),


    url(r'^friend/api/get_friend_list/', friend_api.get_friend_list),
    url(r'^friend/api/get_all_chat_message/', friend_api.get_all_chat_message),
    url(r'^friend/api/send_message/', friend_api.send_message),
    url(r'^friend/api/get_message/', friend_api.get_message),
    url(r'^friend/api/delete_message/', friend_api.delete_message),
    url(r'^friend/api/friend_apply/', friend_api.friend_apply),
    url(r'^friend/api/get_all_apply/', friend_api.get_all_apply),
    url(r'^friend/api/apply_read_deal/', friend_api.apply_read_deal),
    url(r'^friend/api/res_friend_invite/', friend_api.res_friend_invite),


    url(r'^page/login/', views.login),
    url(r'^page/register/', views.register),
    url(r'^page/index/', views.index),
    url(r'^page/person/', views.person),
    url(r'^page/write/', views.write),
    url(r'^page/information/', views.information),
    url(r'^page/apply_deal/', views.apply_deal),
    url(r'^page/friend/', views.friend),
    url(r'^page/chat/', views.chat),
    url(r'^page/mine/', views.mine),
]
