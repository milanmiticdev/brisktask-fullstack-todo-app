// React
import { useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Task.module.css';

const Task = ({ task, setModal }) => {
	const navigate = useNavigate();

	const { token } = useContext(AuthContext);

	const deleteTask = async () => {
		try {
			const response = await fetch(`http://localhost:5174/api/v1/tasks/${task.id}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 204) {
				navigate(0);
			} else {
				const data = await response.json();
				setModal({
					isOpen: true,
					error: true,
					message: data.message,
				});
			}
		} catch {
			setModal({
				isOpen: true,
				error: true,
				message: 'Something went wrong.',
			});
		}
		// navigate(0);
	};

	return (
		<article className={styles.task}>
			<p className={styles.taskText}>{task.name}</p>
			<div className={styles.taskButtons}>
				<Link to={`/update-task/${task.id}`}>
					<button className={`${styles.taskActionBtn} ${styles.editBtn}`}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</Link>
				<button className={`${styles.taskActionBtn} ${styles.deleteBtn}`}>
					<FontAwesomeIcon icon={faTrash} onClick={deleteTask} />
				</button>
			</div>
		</article>
	);
};

export default Task;
