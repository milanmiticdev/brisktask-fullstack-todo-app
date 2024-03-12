const attachUserData = (req, next, token) => {
	req.userData = {
		id: token.userId,
		email: token.userEmail,
		role: token.userRole,
	};
	return next();
};

export default attachUserData;
