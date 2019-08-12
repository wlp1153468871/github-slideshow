# ===========
# build stage
# ===========
FROM node:lts-alpine as build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY .npmrc ./
COPY package*.json ./

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
FROM nginx:1.13 as production-stage

USER root

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx
COPY ./startup.sh /usr/share

RUN chmod a+x /usr/share/startup.sh && chown nginx /etc/nginx

EXPOSE 80

USER nginx
CMD /usr/share/startup.sh && nginx -g 'daemon off;'
