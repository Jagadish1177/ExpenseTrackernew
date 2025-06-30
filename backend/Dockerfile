# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Copy built JAR file
COPY target/backend-app.jar /app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app.jar"]
