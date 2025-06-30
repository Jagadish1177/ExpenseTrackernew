#FROM nginx:alpine

# Remove default page
#RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files (HTML, JSON, JS, etc.)
#COPY . /usr/share/nginx/html

#EXPOSE 80
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
