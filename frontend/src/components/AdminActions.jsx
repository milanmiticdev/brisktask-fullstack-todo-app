//React
import { useState, useRef, useEffect, useContext } from 'react';

// Context
import AuthContext from '../contexts/AuthContext.js';

// Controllers
import userController from './../controllers/user.controller.js';
import taskController from './../controllers/task.controller.js';

// Components
import AdminActionsOption from './AdminActionsOption.jsx';
import AdminActionsBtn from './AdminActionsBtn.jsx';

// Styles
import styles from './AdminActions.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActions = ({ onDispatch }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const selectRef = useRef(null);

	const { token } = useContext(AuthContext);

	const { getAllUsers } = userController;
	const { getAllTasks } = taskController;

	const handleGetAllUsers = async () => await getAllUsers(token, onDispatch);
	const handleGetAllTasks = async () => await getAllTasks(token, onDispatch);

	useEffect(() => {
		const handleClickOutside = e => {
			if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelecting(false);
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [selectRef]);

	return (
		<section className={styles.actions}>
			<AdminActionsBtn text="SELECT ACTION" setIsSelecting={setIsSelecting} />
			{isSelecting && (
				<div className={styles.options} ref={selectRef}>
					<AdminActionsOption text="GET ALL USERS" onClick={handleGetAllUsers} onDispatch={onDispatch} input={false} />
					<AdminActionsOption text="GET USER BY ID" onClick={() => console.log('submit')} onDispatch={onDispatch} />
					<AdminActionsOption text="CREATE USER" onDispatch={onDispatch} />
					<AdminActionsOption text="GET ALL TASKS" onClick={handleGetAllTasks} onDispatch={onDispatch} input={false} />
					<AdminActionsOption text="GET TASKS BY USER ID" onClick={() => console.log('submit')} onDispatch={onDispatch} />
					<AdminActionsOption text="GET TASK BY ID" onClick={() => console.log('submit')} onDispatch={onDispatch} />
				</div>
			)}
		</section>
	);
};

export default AdminActions;

AdminActions.propTypes = {
	state: PropTypes.object,
	onDispatch: PropTypes.func,
};
