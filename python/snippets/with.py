#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

def main():
    """Test with
    """
    with open('hello.txt') as fh:
        for line in fh:
            sys.stdout.write('%s' % line)

if __name__ == '__main__':
    main()
