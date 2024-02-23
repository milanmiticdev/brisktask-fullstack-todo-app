// React
import { useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// Styles
import styles from './Task.module.css';

const Task = ({ task }) => {
	const navigate = useNavigate();

	const { token } = useContext(AuthContext);

	const deleteTask = async () => {
		try {
			await fetch(`http://localhost:5174/api/v1/tasks/${task.id}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch {
			console.log('Something went wrong.');
		}
		navigate(0);
	};

	return (
		<div className="task">
			<p>Task ID: {task.id}</p>
			<p>Task Name: {task.name}</p>
			<Link to={`/tasks/${task.id}`}>
				<button className="btn read">Read</button>
			</Link>
			<Link to={`/tasks/update/${task.id}`}>
				<button className="btn update">Update</button>
			</Link>
			<button className="btn delete" onClick={deleteTask}>
				Delete
			</button>
		</div>
	);
};

export default Task;
