#!/usr/bin/python
# -*- coding: utf-8 -*-
import re
import sys
import urllib
reload(sys)

##############################################
# 计算预估click/request
#
# 先计算show/request
# 再计算click/show
# 用click/show * show/request = click/request
##############################################

show_rate={}
show_ctr={}
request_ctr={}
refer_map={}
request_dict={}
show_dict={}
show_with_refer_dict={}
click_dict={}

if __name__ == "__main__":
    for line in sys.stdin:
        list = line.strip().split('\t');
        request = list[2]
        refer = list[5]
        proto, rest = urllib.splittype(refer)
        res, rest = urllib.splithost(rest)
        refer = "unkonw" if not res else res
        if "GET /api/track?t=show" in request:
            try:
                param_str = request.split("?")[1].split(' ')[0]
                params_list = param_str.split('&')
                params_dict = {}
                for str in params_list:
                    try:
                        (key, value) = str.split('=');
                        params_dict[key] = value
                    except Exception,e:
                        continue
                if ('developer' not in params_dict) or ('sub_prodp' not in params_dict):
                    continue
                key_str = params_dict['developer'] + '\t' + params_dict['sub_prodp']
                if key_str not in show_dict:
                    show_dict[key_str] = 0
                show_dict[key_str] = show_dict[key_str] + 1
                if 'res_name' in params_dict and params_dict['res_name'] != '':
                    key_str2 = params_dict['developer']  + '\t' + refer + '\t' + params_dict['res_name']
                    if key_str2 not in show_with_refer_dict:
                        show_with_refer_dict[key_str2] = 0
                    show_with_refer_dict[key_str2] = show_with_refer_dict[key_str2] + 1
                if refer not in refer_map:
                    refer_map[refer] = params_dict['sub_prodp']
            except Exception,e:
                continue
        elif "GET /jssdk/log.json" in request:
            try:
                param_str = request.split("?")[1].split(' ')[0]
                params_list = param_str.split('&')
                params_dict = {}
                for str in params_list:
                    try:
                        (key, value) = str.split('=');
                        params_dict[key] = value
                    except Exception,e:
                        continue
                if ('License' not in params_dict) or ('Sub_Prodp' not in params_dict) or ('_KEYname1' not in params_dict) or (params_dict['_KEYname1'] != 'T600000'):
                    continue
                key_str = params_dict['License'] + '\t' + params_dict['Sub_Prodp']
                if key_str not in show_dict:
                    request_dict[key_str] = 0
                request_dict[key_str] = request_dict[key_str] + 1
            except Exception,e:
                continue
        elif "GET /api/click" in request:
            try:
                param_str = request.split("?")[1].split(' ')[0]
                params_list = param_str.split('&')
                params_dict = {}
                for str in params_list:
                    try:
                        (key, value) = str.split('=');
                        params_dict[key] = value
                    except Exception,e:
                        continue
                if ('s' not in params_dict) or ('r' not in params_dict):
                    continue
                key_str = params_dict['s']  + '\t' + refer + '\t' + params_dict['r']
                if key_str not in click_dict:
                    click_dict[key_str] = 0
                click_dict[key_str] = click_dict[key_str] + 1
            except Exception,e:
                continue
    # 计算show/request
    for (key, cnt) in show_dict.items():
        if (key in request_dict) and (request_dict[key] > 0):
            show_rate[key] = float(show_dict[key]) / request_dict[key]

    # 计算click/show
    for (key, cnt) in click_dict.items():
        if (key in show_with_refer_dict) and (show_with_refer_dict[key] > 0):
            show_ctr[key] = float(click_dict[key]) / show_with_refer_dict[key]

    # 计算预估click/request
    for (key, rate) in show_ctr.items():
        (developer, refer, banner) = key.split('\t')
        if refer not in refer_map:
            continue
        tmp_key = developer + '\t' + refer_map[refer]
        if tmp_key not in show_rate:
            continue
        # show \t click \t click/show \t show/request \t request \t click/request
        request_ctr[key] = "%d\t%d\t%f\t%f\t%d\t%f" % (show_with_refer_dict[key], click_dict[key], rate, show_rate[tmp_key], int(show_with_refer_dict[key] / show_rate[tmp_key]) , rate * show_rate[tmp_key])
    print "license\turl\tbanner\tshow\tclick\tclick/show\tshow/request\trequest\t(click/request)"
    for (key, str) in request_ctr.items():
        print ("%s\t%s" % (key, str))
