from django.utils.deprecation import MiddlewareMixin
from . import errors
from lib.http import render_json


class ExceptionHandleMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if isinstance(exception, errors.LogicError):
            return render_json(exception.data, exception.code)
        # else:
        #     return render_json('server error')