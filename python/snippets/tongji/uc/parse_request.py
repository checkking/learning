#!/usr/bin/python
import re
import sys
import urllib
reload(sys)

request_dict = {}
click_dict = {}
ctr_dict = {}

if __name__ == "__main__":
    for line in sys.stdin:
        list = line.strip().split('\t');
        request = list[2]
        refer = list[5]
        proto, rest = urllib.splittype(refer)
        res, rest = urllib.splithost(rest)
        refer = "unkonw" if not res else res
        if "GET /jssdk/log.json" in request:
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
                if ('License' not in params_dict) or ('Sub_Product' not in params_dict) or ('_KEYname1' not in params_dict) or ('Res_Name' not in params_dict):
                    continue
                if params_dict['License'] != '3cf0266eaa4f8db33a2b6e3b675a7c5b':
                    continue
                #key_str = params_dict['License'] + '_' + params_dict['Sub_Product'] + '_' + refer + '_' + params_dict['Res_Name']
                key_str = params_dict['License'] + '\t' + params_dict['Sub_Product'] + '\t' + params_dict['Res_Name']
                if params_dict['_KEYname1'] == 'T600000':
                    if key_str not in request_dict:
                        request_dict[key_str] = 0
                    request_dict[key_str] = request_dict[key_str] + 1
                elif params_dict['_KEYname1'] == 'T600004':
                    if key_str not in click_dict:
                        click_dict[key_str] = 0
                    click_dict[key_str] = click_dict[key_str] + 1
            except Exception,e:
                continue
            
    for (key, cnt) in request_dict.items():
        if (cnt > 0) and (key in click_dict) and (request_dict[key] > 0):
            # Show\tClick\tCTR
            ctr_dict[key] = "%d\t%d\t%f" % (request_dict[key], click_dict[key], float(click_dict[key]) / request_dict[key])
            #ctr_dict[key] = "Show:%d\tClick:%d\tClick/Show:%f" % (show_dict[key], click_dict[key], float(click_dict[key]) / show_dict[key])
        else:
            ctr_dict[key] = "0\t0\t0"
            #ctr_dict[key] = "Show:0\tClick:0\tClick/Show:0"
    print "license\tsubproduct\tbanner\trequest\tclick\t(click/request)"
    for (key, result_str) in ctr_dict.items():
        print "%s\t%s" % (key, result_str)
