// mysql2
import mysql, { Pool, PoolOptions } from 'mysql2/promise';

// Config
import config from './config';
const { dbPort, dbHost, dbUser, dbPassword, dbName } = config;

const poolOptions: PoolOptions = {
	port: Number(dbPort),
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: dbName,
};

const pool: Pool = mysql.createPool(poolOptions);

export default pool;
