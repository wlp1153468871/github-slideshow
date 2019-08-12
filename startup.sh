#!/usr/bin/env bash
set -x
set -e

absolute_path="/etc/nginx/nginx.conf"

sed -i "s#VUE_APP_API_URL#${VUE_APP_API_URL-dsp-controller:8000}#g" ${absolute_path}
