#!/bin/env python
# -*- coding: utf-8 -*

from plugins.common_plugin import *

"""
    @author chenkang02
    @brief The plugin manager
    @note
"""

class PluginManager(object):
    """
    class of PluginManager
    """

    def __init__(self):
        self.plugins = {}
        self.plugins['common'] = CommonPlugin()

    def process(self, message):
        """
        process
        for (key, plugin) in self.plugins.items():
            plugin.process(message)
        """
        for key in self.plugins:
            self.plugins[key].process(message)

    def get(self, key):
        """
        get
        """
        if key not in self.plugins:
            return None
        return self.plugins[key]
