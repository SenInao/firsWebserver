import pickle

class Comms:
    factor = 1

    def __init__(self, client) -> None:
        self.client = client

    def send(self, data):
        pack = pickle.dumps(data)
        size = len(pack)
        package = (str(size) + "<SIZE>").encode() + pack

        self.client.sendall(package)

    def receive(self):
        result = self.client.recv(1024)
        result = result.split(b"<SIZE>")

        if result[0]:
            size = int(result[0])
            package = result[1]
            remaining_size = size - len(package)
            receivingSize = self.determineReceivingSize(size)

            if Comms.factor != 1 and remaining_size != 0:
                print(f"receiving package of {size} bytes in chunks of {receivingSize} bytes ...")

            while remaining_size > 0:

                if Comms.factor != 1:
                    print(f"{remaining_size} bytes remaining")

                package += self.client.recv(receivingSize)
                remaining_size = size-len(package)

            return pickle.loads(package)
    
    def determineReceivingSize(self, size):
        receivingSize = int(size * Comms.factor)

        return max(receivingSize, 1024)
