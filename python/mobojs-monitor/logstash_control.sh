#!/bin/bash

JAVA_HOME=/home/work/chenkang/soft/jdk1.8.0_102
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar 

LOG_STASH_HOME=/home/work/chenkang/soft/logstash-5.1.2
PIPE_LINE_CONF=/home/work/chenkang/mobojs-monitor/logstash-pipeline.conf

$LOG_STASH_HOME/bin/logstash -f $PIPE_LINE_CONF --config.reload.automatic
