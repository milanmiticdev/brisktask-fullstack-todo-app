// mysql2
import mysql from 'mysql2/promise';

// Config
import config from './config.js';
const { dbPort, dbHost, dbUser, dbPassword, dbName } = config;

const poolOptions = {
	port: dbPort,
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: dbName,
};

const pool = mysql.createPool(poolOptions);

export default pool;
