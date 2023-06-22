import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status



class InitializeInstance(APIView):
    def get(self, request):
        
        c_id = request.headers.get("cid")
        c_s = request.headers.get("cs")

        verified = False

        if c_id  == "123123" and c_s == "321321":
            verified = True
        

        data = {
            'message': f'This is what you send? {verified}'
        }

        status_code = status.HTTP_200_OK
        return Response(data, status=status_code)