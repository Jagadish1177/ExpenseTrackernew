FROM nginx:alpine

# Remove default page
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files (HTML, JSON, JS, etc.)
COPY . /usr/share/nginx/html

EXPOSE 80
