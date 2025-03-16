# Rentify – Rental Platform webapplication

## Prerequisites
The following tools are required to run the application:
- **Node.js and npm** for the Angular frontend ([Download Node.js](https://nodejs.org/)).
- **Angular CLI** – Install globally:
  ```bash
  npm install -g @angular/cli
  ```
- **Java JDK 11 (or higher)** – ([Download JDK](https://www.oracle.com/java/technologies/javase-downloads.html)).
- **Maven** – ([Download Maven](https://maven.apache.org/download.cgi)).

## Installation

### Frontend (Angular)
Navigate to the frontend directory:
```bash
cd frontend
```
Install the required npm packages:
```bash
npm install
```
Start the Angular development server:
```bash
ng serve
```
The application is accessible by default at [http://localhost:4200](http://localhost:4200).

### Backend (Spring)
Build and start the Spring Boot application using Maven:
```bash
mvn clean spring-boot:run
```
The backend is accessible by default at [http://localhost:8080](http://localhost:8080).

## Configuration

### Application Properties
Before starting the Spring application, the following parameters must be configured in the `application.properties` file:

**Database**  
H2 in-memory is used for the development environment. The following settings can be applied:
```properties
spring.datasource.url=jdbc:h2:mem:rentify;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

**Telegram Bot Token**  
A valid Telegram bot token is required for the messenger bot to function:
```properties
telegram.bot.token=<TELEGRAM_BOT_TOKEN>
```

**Gemini API**  
A key for the Google Gemini API is needed for LLM-generated descriptions:
```properties
gemini.api.key=<GEMINI_API_KEY>
```

**Spring Mail**  
For email testing (e.g., via Mailtrap), the following parameters are required:
```properties
spring.mail.host=smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=<MAILTRAP_USERNAME>
spring.mail.password=<MAILTRAP_PASSWORD>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

