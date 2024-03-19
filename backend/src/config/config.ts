// dotenv
import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
	dbPort: number;
	dbHost: string;
	dbUser: string;
	dbPassword: string;
	dbName: string;
	jwtSecret: string;
	jwtExpires?: number | string;
}

const config: DatabaseConfig = {
	dbPort: Number(process.env.DATABASE_PORT),
	dbHost: String(process.env.DATABASE_HOST),
	dbUser: String(process.env.DATABASE_USER),
	dbPassword: String(process.env.DATABASE_PASSWORD),
	dbName: String(process.env.DATABASE_NAME),
	jwtSecret: String(process.env.JWT_SECRET),
	jwtExpires: process.env.JWT_TOKEN_EXPIRES,
};

export default config;
