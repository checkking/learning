#!/bin/env python
# -*- coding: utf-8 -*

"""
    @author chenkang02
    @brief The router class
    @note
"""

class Router(object):
    """
    Router class
    """
    def __init__(self):
        pass


    def route(self, plugin, plugin_manager):
        """
        route the request with the right plugin
        """
        return plugin_manager.get(plugin)
