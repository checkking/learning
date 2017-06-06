#!/usr/bin/env python
# -*- coding: utf-8 -*-

def is_odd(n):
    return n % 2 == 1

if __name__ == '__main__':
    print filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15])
