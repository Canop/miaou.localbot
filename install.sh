#!/bin/bash

ROOT_PATH=`dirname $0`
PLUGIN_PATH="$ROOT_PATH/plugin"
DEPLOY_PATH="/home/dys/dev/miaou/plugins/localbot"

rm -rf $DEPLOY_PATH
cp -r $PLUGIN_PATH $DEPLOY_PATH
