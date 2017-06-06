#!/usr/bin/env python
# -*- coding: utf-8 -*-

def build(x, y):
    return lambda: x * x + y * y

if __name__ == '__main__':
    f = build(1, 4)
    print f()
