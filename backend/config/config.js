import dotenv from 'dotenv';
dotenv.config();

const config = {
	serverHostname: process.env.SERVER_HOSTNAME,
	serverPort: process.env.SERVER_PORT,
	dbPort: process.env.DATABASE_PORT,
	dbHost: process.env.DATABASE_HOST,
	dbUser: process.env.DATABASE_USER,
	dbPassword: process.env.DATABASE_PASSWORD,
	dbName: process.env.DATABASE_NAME,
	jwtSecret: process.env.JWT_SECRET,
	jwtTokenExpires: process.env.JWT_TOKEN_EXPIRES,
};

export default config;
