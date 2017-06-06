#!/usr/bin/env python
# -*- coding: utf-8 -*-

from wsgiref.simple_server import make_server
from hello import application

httpd = make_server('', 8032, application)
print "Serving HTTP on port 8032..."
httpd.serve_forever()
