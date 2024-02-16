import pool from './../config/database.js';

const login = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const register = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const controller = { login, register };

export default controller;
