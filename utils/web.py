import os
import sys

import socket
from communication import Comms

class HackerSock:
    def __init__(self, ip, port) -> None:
        self.connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.connection.connect((ip, port))
        self.communication = Comms(self.connection)

        self.inDoor = False
        self.commands = []
        self.results = []

id = ":?:_-WebInter"

k = "[+]"
e = "[-]"
PORT = 9000
IP = "localhost"

hacker = HackerSock(IP, PORT)

hacker.communication.send((id, os.getlogin()))

if len(sys.argv) >= 2:
    command = sys.argv
    hacker.communication.send(command)
    result = hacker.communication.receive()

else:
    hacker.communication.send("info")
    result = hacker.communication.receive()

print(result)
