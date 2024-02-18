import requests
import asyncio

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from mainapp.models import User


class InitializeInstance(APIView):
    def get(self, request):

        username = request.headers.get("username")
        password = request.headers.get("password")
        dev_id = request.headers.get("dev-id")
        dev_model = request.headers.get("dev_model")
        print(request.headers)
        try:
            user = User.objects.get(username__exact = username)
            if(user.check_password(password)):

                user.dev_id = dev_id
                user.dev_model = dev_model
                user.save()

                data = {
                    "message": "User exists, device sucregistered"
                }
                status_code = status.HTTP_200_OK
        except:
            data = {
                "message": "User does not exist, device not registered"
            }
            status_code = status.HTTP_200_OK
        
        return Response(data, status=status_code)


class GetMessage(APIView):
    def get(self, request):

        test = request.headers.get("test")
        print(request.headers)
        data = {
            "message": "Message Recieved"
        }
        status_code = status.HTTP_200_OK
        
        return Response(data, status=status_code)
class OpenWS(APIView):
    pass
    # async def handle_message(self, websocket, path):
    #     uuid = await websocket.recv()

    #     connections[uuid] = websocket
    #     print(connections[uuid])
    #     # while True:
    #     #     # Receive messages from the client
    #     #     message = await websocket.recv()
    #     #     print(f"Received message: {message} for UUID: {uuid}")

    #     #     # Choose which client(s) to send the message to based on UUID
    #     #     if uuid == "123":
    #     #         # Send the message to Client 1
    #     #         await connections["123"].send(message)
    #     #     elif uuid == "321":
    #     #         # Send the message to Client 2
    #     #         await connections["321"].send(message)

    # start_server = websockets.serve(handle_message, 'localhost/wsconn', 3312)
    # asyncio.get_event_loop().run_until_complete(start_server)
    # asyncio.get_event_loop().run_forever()