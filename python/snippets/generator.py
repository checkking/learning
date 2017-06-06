#!/usr/bin/env python
# -*- coding: utf-8 -*-

if __name__ == '__main__':
    g = (x * x for x in xrange(10))
    for n in g:
        print n
