#!/usr/bin/python

import thread
import time

def print_time(threadName, delay):

	try:

		thread.start_new_thread(print_time, ("Thread-1", 2,))
		thread.start_new_thread(print_time, ("Thread-2", 4,))

	except:

		print "Error: unable to start thread"

	while 1: pass

print_time("test", 1)
