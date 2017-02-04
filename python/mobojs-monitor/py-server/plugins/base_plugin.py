#!/bin/env python
# -*- coding: utf-8 -*

"""
    @author chenkang02
    @brief The base plugin class defination
    @note
"""

class BasePlugin(object):
    """
    Base class of monitor plugins
    """
    def __init__(self):
        pass

    def process(self, message):
        """
        process the message
        """
        raise NotImplementedError("Should have implemented this mthod process")

    def query(self, params):
        """
        query
        """
        raise NotImplementedError("Should have implemented this mthod query")

    def dump(self):
        """
        dump to persistent
        """
        raise NotImplementedError("Should have implemented this mthod dump")
