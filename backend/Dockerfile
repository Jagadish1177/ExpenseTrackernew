# Use an OpenJDK base image
FROM openjdk:21

# Copy built JAR file
COPY target/expense-tracker-app-0.0.1-SNAPSHOT.jar /app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app.jar"]
