import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status



class InitializeInstance(APIView):
    def get(self, request):
        data = {
            'message': 'Website says Hi!'
        }
        status_code = status.HTTP_200_OK
        return Response(data, status=status_code)