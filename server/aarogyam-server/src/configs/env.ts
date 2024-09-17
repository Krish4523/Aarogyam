import dotenv from "dotenv";

/**
 * Load environment variables from a .env file into process.env
 */
const env = dotenv.config();

// Throw an error if there is an issue loading the environment variables
if (env.error) {
  console.error(env.error);
}

interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  BREVO_API_KEY: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
}

const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  JWT_SECRET: process.env.JWT_SECRET || "",
  BREVO_API_KEY: process.env.BREVO_API_KEY || "",
  BACKEND_URL: process.env.BACKEND_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
};

export default config;
