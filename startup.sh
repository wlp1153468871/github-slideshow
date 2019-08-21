#!/usr/bin/env bash
set -x
set -e

absolute_path="/etc/nginx/nginx.conf"

sed -i "s#API_URL#${API_URL-dsp-controller}#g" ${absolute_path}
