FROM node:latest
#RUN mkdir -p /opt/app
WORKDIR /app
COPY . .
RUN npm install
# Cài đặt PM2 và pm2-logrotate
RUN npm install -g pm2 pm2-logrotate

# Thiết lập pm2-logrotate
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:retain 7
RUN pm2 set pm2-logrotate:compress true
# Xoay vòng hàng ngày
RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  

# Sử dụng ARG để truyền giá trị khi build
ARG NODE_ENV=production
# Thiết lập biến môi trường
ENV NODE_ENV $NODE_ENV

EXPOSE 3000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]