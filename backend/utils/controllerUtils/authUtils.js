// jsonwebtoken
import jwt from 'jsonwebtoken';

// Config
import config from '../../config/config.js';
const { jwtSecret, jwtExpires } = config;

const createToken = (auth, result, email) => {
	const user = {
		userId: auth === 'login' ? result.id : result.insertId,
		userEmail: auth === 'login' ? result.email : email.trim(),
		userRole: auth === 'login' ? result.role : 'user',
	};

	// Creating a token
	const token = jwt.sign(user, jwtSecret, {
		expiresIn: jwtExpires,
	});

	return token;
};

const authResponse = (res, auth, result, email, token) => {
	const user = {
		userId: auth === 'login' ? result.id : result.insertId,
		userEmail: auth === 'login' ? result.email : email.trim(),
		userRole: auth === 'login' ? result.role : 'user',
	};
	const json = { token, result: user, message: auth === 'login' ? 'Login successful.' : 'Registration successful.', status: 201 };

	return res.status(201).json(json);
};

export default { createToken, authResponse };
