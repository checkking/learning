#!/usr/bin/python
import re
import sys
import urllib
import getopt
reload(sys)

t520000_dict = {}
t520003_dict = {}
t520004_dict = {}

ctr_dict = {}

if __name__ == "__main__":
    opts, args = getopt.getopt(sys.argv[1:], "d")
    use_refer = False
    for op, value in opts:
        if op == '-d':
            use_refer = True
    for line in sys.stdin:
        list = line.strip().split('\t');
        request = list[2]
        refer = list[5]
        proto, rest = urllib.splittype(refer)
        res, rest = urllib.splithost(rest)
        refer = "unkonw" if not res else res
        if use_refer:
            refer = refer + '\t'
        else:
            refer = ''
        if "GET /jssdk/log.json" in request:
            try:
                param_str = request.split("?")[1].split(' ')[0]
                params_list = param_str.split('&')
                params_dict = {}
                for str in params_list:
                    try:
                        (key, value) = str.split('=');
                        params_dict[key] = value
                    except:
                        continue
                if ('License' not in params_dict) or ('Sub_Product' not in params_dict) or ('_KEYname1' not in params_dict) or ('Res_Name' not in params_dict):
                    continue
                key_str = params_dict['License'] + '\t' + params_dict['Sub_Product']\
                        + '\t' + refer + params_dict['Res_Name']
                """
                if params_dict['_KEYname1'] == 'T520000' or params_dict['_KEYname1'] == 'T500000' or params_dict['_KEYname1'] == 'T510000' or params_dict['_KEYname1'] == 'T530000' or params_dict['_KEYname1'] == 'T540000':
                    if key_str not in t520000_dict:
                        t520000_dict[key_str] = 0
                    t520000_dict[key_str] = t520000_dict[key_str] + 1
                """
                if params_dict['_KEYname1'] == 'T520003' or params_dict['_KEYname1'] == 'T500003' or params_dict['_KEYname1'] == 'T510003' or params_dict['_KEYname1'] == 'T530003' or params_dict['_KEYname1'] == 'T540003':
                    if key_str not in t520003_dict:
                        t520003_dict[key_str] = 0
                    t520003_dict[key_str] = t520003_dict[key_str] + 1
                elif params_dict['_KEYname1'] == 'T520004' or params_dict['_KEYname1'] == 'T500004' or params_dict['_KEYname1'] == 'T510004' or params_dict['_KEYname1'] == 'T530004' or params_dict['_KEYname1'] == 'T540004':
                    if key_str not in t520004_dict:
                        t520004_dict[key_str] = 0
                    t520004_dict[key_str] = t520004_dict[key_str] + 1
                else:
                    continue
            except:
                continue
    for (key, cnt) in t520003_dict.items():
        if (cnt > 0) and (key in t520004_dict) and (t520004_dict[key] > 0):
            ctr_dict[key] = "%d\t%d\t%f" % (t520003_dict[key], t520004_dict[key], float(t520004_dict[key]) / cnt) 
        else:
            ctr_dict[key] = "%d\t0\t0" % (cnt)
    for (key, str) in ctr_dict.items():
        print "%s\t%s" % (key, str)
