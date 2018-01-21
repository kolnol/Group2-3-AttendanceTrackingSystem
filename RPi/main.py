#!/usr/bin/env python -*- coding: UTF-8 -*-

import os
import signal
import subprocess
import requests
import json

queue = []

def startWebCamera():
    zbarcam = subprocess.Popen("zbarcam --raw /dev/video0", stdout=subprocess.PIPE, shell=True,
                               preexec_fn=os.setsid)
    print("zbarcam was successfully started...")
    return zbarcam


def stopCamera(zbarcam):
    os.killpg(zbarcam.pid, signal.SIGTERM)
    print("zbarcam was successfully stopped")


def waitForQrCode(zbarcam):
    while True:
        qrcodetext = zbarcam.stdout.readline()
        if qrcodetext != "":
            print("Success. Scanned QR code is:\n" + qrcodetext)
            return qrcodetext


def sendToNotary(notaryData):
    if notaryData:
        notaryUrl = ''  # todo
        response = requests.post(notaryUrl, data=notaryData)


def validateQrCode(qrCodeText):
    apiUrl = 'https://atseguestbook-185902.appspot.com/servlet/attendanceToken'
    token = {'token': qrCodeText.replace('\n', '')}
    print(token)
    dataJson = json.dumps(token)

    print(dataJson)
    response = requests.post(apiUrl, data=dataJson)
    print(response)
    if response and response.status_code == 200:
        print('Validated. Sending to notary')
        # sendToNotary(response.json())
    else:
        print('Not Valid!')


def main():
    zbarcam = startWebCamera()
    qrCodeText = waitForQrCode(zbarcam)
    stopCamera(zbarcam)
    validateQrCode(qrCodeText)


if __name__ == "__main__":
    main()
