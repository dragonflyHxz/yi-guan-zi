from django.shortcuts import render


def login(request):
    return render(request, 'login.html',)


def register(request):
    return render(request, 'register.html')


def index(request):
    return render(request, 'index.html')


def person(request):
    return render(request, 'person.html')


def write(request):
    return render(request, 'write.html')


def information(request):
    return render(request, 'information.html')


def apply_deal(request):
    return render(request, 'apply_deal.html')

def friend(request):
    return render(request, 'friend.html')


def chat(request):
    return render(request, 'chat.html')


def mine(requset):
    return render(requset, 'mine.html')
