# ===========
# build stage
# ===========
FROM daocloud.io/atsctoo/rhel8-nodejs-10:1-87 as build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY .npmrc ./
COPY package*.json ./

USER root

# install project dependencies
RUN npm ci

COPY . /app/

# setting env
ENV APP_DEBUG=true
ENV NODE_ENV=production
ENV VUE_APP_API_URL="."

RUN npm run build

# ================
# production stage
# ================
FROM daocloud.io/atsctoo/rhel8-nginx-114:1-87 as production-stage
MAINTAINER zhenghao.zhu@daocloud.io

USER root

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx
COPY ./startup.sh /usr/share

RUN chmod a+x /usr/share/startup.sh && chown nginx /etc/nginx

EXPOSE 8443

USER nginx
CMD /usr/share/startup.sh && nginx -g 'daemon off;'
