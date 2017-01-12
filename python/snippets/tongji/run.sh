#!/bin/bash

logfile=/home/soft/resty/nginx/logs/access.js_mobojoy.conf.log
use_refer=false
comput_hour=0
license=''
sub_product=''

while getopts "h:ds:l:" opt
do
    case $opt in
        d)
            use_refer=true;;
        h)
            comput_hour=$OPTARG;;
        l)
            license=$OPTARG;;
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
use_domain=''
if [[ ${use_refer} == true ]]; then
    use_domain='-d'
fi
if [[ ${license} == '' ]] && [[ ${sub_product} == '' ]];then
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | python parse_request.py ${use_domain} | sort
elif [[ ${license} == '' ]];then
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | python parse_request.py ${use_domain} | sort | grep ${sub_product}
elif [[ ${sub_product} == '' ]];then
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | python parse_request.py ${use_domain} | sort | grep ${license}
else
    tail -n ${compute_lines} ${logfile} | python parse_nginx_log.py | python parse_request.py ${use_domain} | sort | grep ${license} | grep ${sub_product}
fi
