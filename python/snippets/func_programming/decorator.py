#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time

def log(func):
    def wrapper(*args, **kv):
        print 'call %s():' % func.__name__
        return func(*args, **kv)
    return wrapper

@log
def now():
    print time.strftime('%Y-%m-%d',time.localtime(time.time()))

if __name__ == '__main__':
    now()
