// React
import { useState, useEffect, useContext } from 'react';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// Controllers
import taskController from './../../controllers/task.controller.js';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Task.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Task = ({ task, onDispatch }) => {
	const [taskName, setTaskName] = useState(task.name ? task.name : '');
	const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	const { userRole, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { deleteTaskById } = taskController;

	const handleDeleteTaskById = async () => await deleteTaskById(task.id, userRole, token, onDispatch, navigate);

	useEffect(() => {
		function handleWindowResize() {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		}

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	useEffect(() => {
		if (task.name) {
			if (windowSize.width < 300) {
				if (task.name.length > 20) {
					setTaskName(`${task.name.slice(0, 17)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 300 && windowSize.width < 400) {
				if (task.name.length > 26) {
					setTaskName(`${task.name.slice(0, 23)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 400 && windowSize.width < 500) {
				if (task.name.length > 38) {
					setTaskName(`${task.name.slice(0, 35)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 500 && windowSize.width < 600) {
				if (task.name.length > 41) {
					setTaskName(`${task.name.slice(0, 38)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 600 && windowSize.width < 700) {
				if (task.name.length > 48) {
					setTaskName(`${task.name.slice(0, 45)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 700 && windowSize.width < 900) {
				if (task.name.length > 46) {
					setTaskName(`${task.name.slice(0, 43)}...`);
				} else {
					setTaskName(task.name);
				}
			} else if (windowSize.width >= 900 && windowSize.width < 1200) {
				if (task.name.length > 50) {
					setTaskName(`${task.name.slice(0, 47)}...`);
				} else {
					setTaskName(task.name);
				}
			} else {
				if (task.name.length > 73) {
					setTaskName(`${task.name.slice(0, 70)}...`);
				} else {
					setTaskName(task.name);
				}
			}
		}
	}, [task.name, windowSize.width]);

	return (
		<article className={styles.task}>
			<p className={styles.taskText}>{taskName}</p>
			<div className={styles.taskButtons}>
				<Link to={`/update-task/${task.id}`}>
					<button className={`${styles.taskActionBtn} ${styles.editBtn}`}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</Link>
				<button className={`${styles.taskActionBtn} ${styles.deleteBtn}`}>
					<FontAwesomeIcon icon={faTrash} onClick={handleDeleteTaskById} />
				</button>
			</div>
		</article>
	);
};

export default Task;

Task.propTypes = {
	task: PropTypes.object,
	onDispatch: PropTypes.func,
};
