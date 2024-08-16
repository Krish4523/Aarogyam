# Aarogyam Healthcare - Aarogyam Server

The Aarogyam Server is a key component of the Aarogyam healthcare application, providing backend services for managing
healthcare data. This microservice is built with TypeScript, Express, Prisma, and PostgreSQL, and is containerized using
Docker.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Database Migration](#database-migration)
- [Prisma Studio](#prisma-studio)
- [Docker](#docker)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [License](#license)

## Requirements

To set up and run the Aarogyam Server, you need the following:

- **Node.js**: Version 20 or higher
- **npm** or **yarn**: For managing packages
- **Docker**: For containerizing the application

## Installation

Follow these steps to set up the Aarogyam Server:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Aarogyam-Healthcare/Aarogyam
   cd server/aarogyam-server
   ```

2. **Install Dependencies**

   Install the required packages using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

Create a `.env` file in the root directory of the project with the following configuration:

```env
# Server Port
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=6000
DB_USER=root
DB_PASS=root
DB_NAME=aarogyam

# JWT Secret Key
JWT_SECRET=
# Generate a new secret key using:
# $ openssl rand -base64 64

# Database connection string for Prisma
DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Brevo API Key
BREVO_API_KEY=

# Backend URL
BACKEND_URL=http://localhost:${PORT}
```

- **`PORT`**: The port number on which the server will run.
- **Database Configuration**: The connection details for the PostgreSQL database.
- **`JWT_SECRET`**: Secret key used for signing JSON Web Tokens. Generate a new key if not already set.
- **`DATABASE_URL`**: Connection string for Prisma to connect to the PostgreSQL database.
- **`BREVO_API_KEY`**: API key for Brevo services.
- **`BACKEND_URL`**: The URL of the backend service.

## Usage

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The server will be accessible at `http://localhost:3000`.

## Database Migration

To set up the database schema and generate the Prisma client:

1. **Run Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

   This command applies the database migrations.

2. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

   This command generates the Prisma client based on your schema.

## Prisma Studio

Prisma Studio is a visual editor for managing your database. It allows you to view and interact with your data in a
user-friendly interface.

To open Prisma Studio:

```bash
npx prisma studio
```

This command launches Prisma Studio in your default web browser. You can use it to browse, edit, and manage your
database records.

## Docker

To run the server and database using Docker, follow these steps:

1. **Start Services**

   ```bash
   docker-compose up
   ```

   This command starts both the `main-service` and `aarogyam-db` services defined in the `docker-compose.yml` file.

2. **Stop Services**

   ```bash
   docker-compose down
   ```

   This command stops and removes the running containers.

## Scripts

Here are the available npm scripts:

- **`dev`**: Start the development server with `ts-node-dev`.
- **`start`**: Start the production server with `node`.
- **`build`**: Compile TypeScript code and apply `tsc-alias`.
- **`lint`**: Lint the code using TSLint.
- **`lint:fix`**: Fix linting errors with TSLint.
- **`format`**: Format the code using Prettier.
- **`format:check`**: Check code formatting with Prettier.

## API Documentation

For detailed API documentation, refer to the [Postman Documentation](https://documenter.getpostman.com/view/30513437/2sA3s7kpdM).

## License

This project is licensed under the ISC License.