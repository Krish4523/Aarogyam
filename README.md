# Aarogyam - Healthcare App

Aarogyam is a comprehensive healthcare application designed to provide users with a seamless experience for managing their health and wellness. The application includes a client-side interface built with React and TypeScript, a server-side API built with Node.js and Express, and a PostgreSQL database for data storage.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [License](#license)

## Features

- User authentication and authorization
- Health data management
- Appointment scheduling
- Notifications and reminders
- Responsive design

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **API Gateway**: Nginx

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/aarogyam.git
    cd aarogyam
    ```

2. Install dependencies for the client and server:
    ```sh
    cd client/aarogyam-client
    npm install
    cd ../../server/aarogyam-server
    npm install
    ```

### Running the Application

1. Start the application using Docker Compose:
    ```sh
    docker-compose up --build
    ```

2. The client will be available at `http://localhost:3000` and the API gateway at `http://localhost`.

3. To run only the backend service:
    ```sh
    docker-compose up --build aarogyam-db main-service api-gateway
    ```

4. To run only the frontend service:
    ```sh
    docker-compose up --build aarogyam-client
    ```

5. To apply database migrations using Prisma:
    ```sh
    docker-compose exec main-service npx prisma migrate deploy
    ```

## Configuration

Environment variables are used for configuration. Create a `.env` file in the root directory and add the following variables:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=aarogyam
# JWT Secret Key
JWT_SECRET= # $ openssl rand -base64 64
DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME} # Database connection string for Prisma
BREVO_API_KEY=
BACKEND_URL=http://localhost
```
## License

This project is licensed under the ISC License.