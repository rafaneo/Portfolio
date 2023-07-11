import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from mainapp.models import User


class InitializeInstance(APIView):
    def get(self, request):

        username = request.headers.get("username")
        password = request.headers.get("password")

        try:
            user = User.objects.get(username__exact = username)
            if(user.check_password(password)):
                data = {
                    "message": "User exists, device registered"
                }
                status_code = status.HTTP_200_OK
        except:
            data = {
                "message": "User does not exist, device not registered"
            }
            status_code = status.HTTP_200_OK
        
        return Response(data, status=status_code)

            
           
