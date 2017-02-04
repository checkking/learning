#!/bin/env python
# -*- coding: utf-8 -*

import json
import time

from base_plugin import *

"""
    @author chenkang02
    @brief common plugin
    @note process common data, such as total pv/show, etc.
"""
class CommonPlugin(BasePlugin):
    """
    Common Plugin class
    """
    def __init__(self):
        # store the result hourly
        self.dict = {}
        self.dict['request'] = {
            'total': 0
        }

    def process(self, message):
        """
        process
        """
        self.dict['request']['total'] = self.dict['request']['total'] + 1
        dt = time.strptime(message['time_local'], "%d/%b/%Y:%H:%M:%S +0800")
        hour = dt.tm_hour
        if 'hourly' not in self.dict['request']:
            self.dict['request']['hourly'] = {}
        if hour not in self.dict['request']['hourly']:
            self.dict['request']['hourly'][hour] = 0
        http_refer = message['http_referer'].lstrip('"').rstrip('"')
        if http_refer not in self.dict['request']:
            self.dict['request'][http_refer] = {}
        if 'total' not in self.dict['request'][http_refer]:
            self.dict['request'][http_refer]['total'] = 0
        if hour not in self.dict['request'][http_refer]:
            self.dict['request'][http_refer][hour] = 0
        self.dict['request']['hourly'][hour] = self.dict['request']['hourly'][hour] + 1
        self.dict['request'][http_refer]['total'] = self.dict['request'][http_refer]['total'] + 1
        self.dict['request'][http_refer][hour] = self.dict['request'][http_refer][hour] + 1

    def search(self, params = None):
        dict = {}
        print self.dict['request']
        if not params:
            dict['total'] = 'total' in self.dict['request'] and self.dict['request']['total'] or None
            dict['hourly'] = 'hourly' in self.dict['request'] and self.dict['request']['hourly'] or None
        elif 'refer' in params and (params['refer'] in self.dict['request']):
            dict['total'] = 'total' in self.dict['request'][params['refer']] and self.dict['request'][params['refer']]['total'] or None
            dict['hourly'] = {}
            for hour in self.dict['request'][params['refer']]:
                if hour != 'total':
                    dict['hourly'][hour] = self.dict['request'][params['refer']][hour]
        return json.dumps(dict)

    def dump(self):
        """
        dump the result to mysql
        """
        pass
