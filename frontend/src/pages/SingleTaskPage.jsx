// React
import { useState, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useParams } from 'react-router-dom';

// Components
import Message from './../components/Message.jsx';

// Utils
import UTCtoLocal from '../utils/UTCtoLocal.js';

const SingleTaskPage = () => {
	const [task, setTask] = useState({});
	const [message, setMessage] = useState('');
	const { taskId } = useParams();

	const { token } = useContext(AuthContext);

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
					setMessage(data.message);
					setTask(data.task);
				} else {
					setMessage(data.message);
				}
			} catch {
				setMessage('Something went wrong.');
			}
		};
		getTask();
	}, [taskId, token]);

	return (
		<div>
			{task && Object.keys(task).length > 0 ? (
				<div className="task">
					<p>id: {task.id}</p>
					<p>name: {task.name}</p>
					<p>Created: {`${UTCtoLocal(task.createdAt).date} ${UTCtoLocal(task.createdAt).time}`}</p>
					<p>Updated: {`${UTCtoLocal(task.updatedAt).date} ${UTCtoLocal(task.updatedAt).time}`}</p>
				</div>
			) : (
				<Message message={message} />
			)}
		</div>
	);
};

export default SingleTaskPage;
