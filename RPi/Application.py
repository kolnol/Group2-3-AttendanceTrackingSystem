from Tkinter import *
import time


class Application(Frame):

    def __init__(self):
        self.master = Tk()
        self.seconds_to_wait = 2
        self.master.title = 'Attendance Registration'
        self.master.geometry('200x200')
        # self.master.mainloop()
        Frame.__init__(self, self.master)
        self.grid()

    def update(self):
        self.master.update()

    def showApprove(self):
        self.master.configure(background='green')
        self.update()
        time.sleep(self.seconds_to_wait)
        self.master.configure(background='gray')

    def showReject(self):
        self.master.configure(background='red')
        self.update()
        time.sleep(self.seconds_to_wait)
        self.master.configure(background='gray')
