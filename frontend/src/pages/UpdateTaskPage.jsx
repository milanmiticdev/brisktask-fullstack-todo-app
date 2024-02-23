// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Message from './../components/Message.jsx';

// Utils
import validation from './../utils/validation.js';

// Styles
import styles from './UpdateTaskPage.module.css';

// Initial reducer state
const initialState = {
	value: '',
	status: {
		error: true,
		message: '',
	},
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'value-change':
			return { ...state, value: action.payload };
		case 'status-change':
			return { ...state, status: action.payload };
	}
};

const UpdateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { taskId } = useParams();
	const { token } = useContext(AuthContext);
	const { validateName } = validation;
	const navigate = useNavigate();

	useEffect(() => {
		const getTask = async () => {
			try {
				const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
					method: 'GET',
					body: null,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();

				if (data.status === 200) {
					dispatch({ type: 'value-change', payload: data.task.name });
				}
			} catch {
				console.log('Something went wrong.');
			}
		};
		getTask();
	}, [taskId, token]);

	const updateTask = async e => {
		e.preventDefault();

		try {
			const updatedTask = {
				name: state.value,
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
				navigate('/tasks');
			}
		} catch {
			console.log('Something went wrong.');
		}
	};

	return (
		<form onSubmit={updateTask} className={styles.form}>
			<label htmlFor="update_name" className={styles.label}>
				UPDATE TASK
			</label>
			<input
				className={styles.input}
				id="update_name"
				name="update_name"
				type="text"
				value={state.value}
				onChange={e => {
					dispatch({ type: 'value-change', payload: e.target.value });
					dispatch({ type: 'status-change', payload: validateName(e.target.value) });
				}}
			/>
			<Message message={state.status.message} />
			<button className={styles.createBtn} type="submit">
				UPDATE
			</button>
		</form>
	);
};

export default UpdateTaskPage;
