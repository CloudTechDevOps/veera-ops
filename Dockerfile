FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

# Copy all files from current directory
COPY . /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]