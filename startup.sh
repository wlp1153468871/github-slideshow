#!/usr/bin/env bash

sed -i "s#VUE_APP_API_URL#${VUE_APP_API_URL}#g" /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
