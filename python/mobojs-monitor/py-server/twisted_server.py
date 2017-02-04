#!/bin/env python
# -*- coding: utf-8 -*

import json
from twisted.internet import protocol, reactor, endpoints
from server_cfg import server_cfg
from plugin_manager import *
from router import *

plugin_manager = PluginManager()
router = Router()

class Monitor(protocol.Protocol):
    def __init__(self):
        pass
        #self.plugin_manager = PluginManager()
        #self.router = Router()

    def dataReceived(self, data):
        message = None
        print message
        try:
            message = json.loads(data)
        except:
            return
        if 'plugin' in message:
            ## search request
            #plugin = self.router.route(message['plugin'], self.plugin_manager)
            plugin = plugin_manager.get(message['plugin'])
            if not plugin:
                self.transport.write('No plugin found')
            else:
                self.transport.write(plugin.search('params' in message and message['params'] or None))
        else:
            plugin_manager.process(message)

class MonitorFactory(protocol.Factory):
    def buildProtocol(self, addr):
        return Monitor()

endpoints.serverFromString(reactor, "tcp:%d" % server_cfg.port).listen(MonitorFactory())
reactor.run()
