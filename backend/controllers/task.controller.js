const getAllTasks = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const getTasksByUserId = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const getTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const createTask = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const updateTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const deleteTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
