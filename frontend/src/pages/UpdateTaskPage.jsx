// React
import { useState, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Message from './../components/Message.jsx';

const UpdateTaskPage = () => {
	const [taskName, setTaskName] = useState('');
	const [message, setMessage] = useState('');
	const { taskId } = useParams();
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		const getTask = async () => {
			try {
				const response = await fetch(`http://localhost:5174/api/v1/tasks/${taskId}`, {
					method: 'GET',
					body: null,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();

				if (data.status === 200) {
					setTaskName(data.task.name);
					setMessage(data.message);
				} else {
					setMessage(data.message);
				}
			} catch {
				setMessage('Something went wrong.');
			}
		};
		getTask();
	}, [taskId, token]);

	const updateTask = async e => {
		e.preventDefault();

		try {
			const updatedTask = {
				name: taskName,
			};

			const response = await fetch(`http://localhost:5174/api/v1/tasks/${taskId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTask),
			});
			const data = await response.json();

			if (data.status === 200) {
				setMessage(data.message);
				navigate('/tasks');
			} else {
				setMessage(data.message);
			}
		} catch {
			setMessage('Something went wrong.');
		}
	};

	return (
		<div>
			<br />
			{taskName && taskName.length > 0 ? (
				<form onSubmit={updateTask}>
					<label htmlFor="task_name">Update task with ID: {taskId}</label>
					<br />
					<br />
					<input type="text" id="task_name" value={taskName} onChange={e => setTaskName(e.target.value)} />
					<br />
					<br />
					<Message message={message} />
					<button type="submit">Update</button>
				</form>
			) : (
				<Message message={message} />
			)}
		</div>
	);
};

export default UpdateTaskPage;
