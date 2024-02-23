// React
import { useState, useContext } from 'react';

// Contenxt
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import Message from './../components/Message.jsx';

const CreateTaskPage = () => {
	const [taskInput, setTaskInput] = useState('');
	const [finalMessage, setFinalMessage] = useState('');
	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			const task = {
				name: taskInput,
			};

			const response = await fetch('http://localhost:5174/api/v1/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(task),
			});
			const data = await response.json();

			if (data.status === 201) {
				setFinalMessage(data.message);
				navigate('/tasks');
			} else {
				setFinalMessage(data.message);
			}
		} catch {
			setFinalMessage('Something went wrong.');
		}
	};

	return (
		<div>
			<br />
			<form onSubmit={handleSubmit}>
				<label htmlFor="task_name">Task Name</label>
				<br />
				<br />
				<input type="text" id="task_name" value={taskInput} onChange={e => setTaskInput(e.target.value)} />
				<br />
				<br />
				<Message message={finalMessage} />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default CreateTaskPage;
