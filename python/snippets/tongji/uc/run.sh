#!/bin/bash

logfile=/home/soft/resty/nginx/logs/access.js_mobojoy.conf.log
use_refer=false
comput_hour=0
license='3cf0266eaa4f8db33a2b6e3b675a7c5b'
sub_product=''

while getopts "h:ds:l:" opt
do
    case $opt in
        d)
            use_refer=true;;
        h)
            comput_hour=$OPTARG;;
        s)
            sub_product=$OPTARG;;
        ?)
            echo "error"
            exit 1;;
        esac
done
total_lines=`sed -n '$=' ${logfile}`
# 估算每小时的日志行数
now=`date +%H:%M:%S`
arr=(${now//:/ })
hour=${arr[0]}
hour=`expr $hour + 0`
min=${arr[1]}
min=`expr $min + 0`
minutes=$((hour*60+min))
log_every_minute=$((total_lines/minutes))
#要计算的行数
compute_lines=$((log_every_minute*comput_hour*60))
if [[ ${compute_lines} == 0 ]]; then
    compute_lines=${total_lines}
fi
script=parse_request.py
if [[ ${use_refer} == true ]]; then
    sub_product=''
    script=parse_request_with_refer.py
fi
if [[ ${sub_product} == '' ]];then
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | grep ${license} | python ${script} | sort
else
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | grep ${license} | grep ${sub_product} | python ${script} | sort
fi
