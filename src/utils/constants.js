process.loadEnvFile();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = "node-auth";
export const JWT_SECRET = process.env.JWT_SECRET;
