docker run -d -p 80:80 \
  -e API_SERVER_HOST=192.168.31.36 \
  -e API_SERVER_PORT=8080 \
  power-scheduler-console:latest