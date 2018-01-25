#!/usr/bin/env python -*- coding: UTF-8 -*-

from os import _exit
import signal
import subprocess
import requests
import json
import urllib2
from Tkinter import *
import Application

import Camera

queue = []
camera = Camera.Camera()
apiUrl = 'https://atseguestbook-185902.appspot.com/servlet/attendanceToken'
notaryUrl = 'http://35.189.84.234:3000/addAttendance'
app = Application.Application()


def internet_on():
    try:
        urllib2.urlopen(apiUrl, timeout=1)
        return True
    except urllib2.URLError as err:
        return False


def sendToNotary(notaryData):
    if notaryData:
        print(notaryData)
        headers = {'Content-type': 'application/json'}
        response = requests.post(notaryUrl, data=notaryData, headers=headers)
        print(response.json())


def sendToValidationServer(qrCodeText):
    token = {'token': qrCodeText.replace('\n', '')}
    print(token)
    dataJson = json.dumps(token)

    print(dataJson)
    response = requests.post(apiUrl, data=dataJson)
    print(response)
    if response and response.status_code == 200:
        print('Validated. Sending to notary...')
        app.showApprove()
        sendToNotary(json.dumps(response.json()))
    else:
        print('Not Valid!')
        app.showReject()


def validate(qrcodetext):
    if internet_on():
        if len(queue) == 0:
            sendToValidationServer(qrcodetext)
        else:
            queue.append(qrcodetext)
            for qrcode in queue:
                sendToValidationServer(qrcode)
    else:
        queue.append(qrcodetext)


# TODO The process of defining start and end of session

def main():
    camera.start()
    while True:
        app.update()
        qrcodetext = camera.scanQrCode()
        # camera.stop()
        sendToValidationServer(qrcodetext)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print 'Interrupted'
        try:
            camera.stop()
            sys.exit(0)
        except SystemExit:
            _exit(0)
