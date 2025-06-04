FROM nginx:alpine

COPY dist/ /usr/share/nginx/html
COPY ./docker/nginx.template.conf /etc/nginx/conf.d/default.conf

ENV API_SERVER_HOST=127.0.0.1
ENV API_SERVER_PORT=8080

# 启动时用 envsubst 替换变量并启动 nginx
CMD ["/bin/sh", "-c", "envsubst '$API_SERVER_HOST $API_SERVER_PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

EXPOSE 80