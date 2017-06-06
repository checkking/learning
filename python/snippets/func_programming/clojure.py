#!/usr/bin/env python
# -*- coding: utf-8 -*-

def count():
    fs = []
    for i in xrange(1, 4):
        def f(j):
            def g():
                return j*j
            return g
        fs.append(f(i))
    return fs

if __name__ == '__main__':
    f1, f2, f3 = count()
    print f1()
    print f2()
    print f3()
