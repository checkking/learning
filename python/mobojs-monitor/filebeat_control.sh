#!/bin/bash

FILEBEAT_HOME=/home/work/chenkang/soft/filebeat-5.1.2-linux-x86_64
FILEBEAT_CONF=/home/work/chenkang/mobojs-monitor/filebeat.yml

$FILEBEAT_HOME/filebeat -e -c $FILEBEAT_CONF -d "publish"
