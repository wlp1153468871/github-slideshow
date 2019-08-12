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
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY startup.sh startup.sh
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["bash", "startup.sh"]
