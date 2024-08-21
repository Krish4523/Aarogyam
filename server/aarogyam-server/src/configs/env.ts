import dotenv from "dotenv";

// Load environment variables from a .env file into process.env
const env = dotenv.config();

// Throw an error if there is an issue loading the environment variables
if (env.error) {
  console.error(env.error);
}

/**
 * Interface representing the configuration for environment variables.
 */
interface EnvConfig {
  PORT: number; // The port number on which the server will run
  JWT_SECRET: string; // Secret key for JWT authentication
  BREVO_API_KEY: string; // API key for Brevo service
  BACKEND_URL: string; // URL of the backend server
}

// Define the configuration object with environment variables
const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3000", 10), // Parse the port number from environment or default to 3000
  JWT_SECRET: process.env.JWT_SECRET || "", // Get JWT secret from environment or default to an empty string
  BREVO_API_KEY: process.env.BREVO_API_KEY || "", // Get Brevo API key from environment or default to an empty string
  BACKEND_URL: process.env.BACKEND_URL || "", // Get backend URL from environment or default to an empty string
};

export default config;
