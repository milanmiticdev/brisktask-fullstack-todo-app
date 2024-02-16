const getAllUsers = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const getUserById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const createUser = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const updateUserById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const deleteUserById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById };

export default controller;
