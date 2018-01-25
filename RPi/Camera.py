import os
import signal
import subprocess


class Camera:
    def __init__(self):
        self.zbarcam = None

    def start(self):
        self.zbarcam = subprocess.Popen("zbarcam --raw /dev/video0", stdout=subprocess.PIPE, shell=True,
                                           preexec_fn=os.setsid)
        print("zbarcam was successfully started...")

    def stop(self):
        os.killpg(self.zbarcam.pid, signal.SIGTERM)
        print("zbarcam was successfully stopped")

    def scanQrCode(self):
        while True:
            qrcodetext = self.zbarcam.stdout.readline()
            if qrcodetext != "":
                print("Success. Scanned QR code is:\n" + qrcodetext)
                return qrcodetext
