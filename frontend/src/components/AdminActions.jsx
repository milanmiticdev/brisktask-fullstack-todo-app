//React
import { useRef, useEffect, useContext } from 'react';

// Context
import AuthContext from '../contexts/AuthContext.js';

// Utils
import userController from './../utils/controllers/user.controller.js';
import taskController from './../utils/controllers/task.controller.js';

// Components
import SelectBtn from './SelectBtn.jsx';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './AdminActions.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActions = ({ state, dispatch }) => {
	const selectRef = useRef(null);

	const { token } = useContext(AuthContext);

	const { getAllUsers } = userController;
	const { getAllTasks } = taskController;

	const handleGetAllUsers = async () => {
		await getAllUsers(token, dispatch);
	};

	const handleGetAllTasks = async () => {
		await getAllTasks(token, dispatch);
	};

	useEffect(() => {
		const handleClickOutside = e => {
			if (selectRef.current && !selectRef.current.contains(e.target)) {
				dispatch({ type: 'is-selecting', payload: false });
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [selectRef, dispatch]);

	return (
		<section className={styles.actions}>
			<section className={styles.selection}>
				<SelectBtn text="SELECT ACTION" dispatch={dispatch} />
				{state.isSelecting && (
					<div className={styles.options} ref={selectRef}>
						<div className={styles.option}>
							<button className={styles.btn} onClick={handleGetAllUsers}>
								GET ALL USERS
							</button>
						</div>
						<div className={styles.option}>
							<form>
								<input
									type="number"
									className={styles.idInput}
									value={state.inputId}
									onChange={e => dispatch({ type: 'id-change', payload: e.target.value })}
								/>
								<button type="submit" className={styles.btn} onClick={handleGetAllTasks}>
									GET USER BY ID
								</button>
							</form>
						</div>
						<div className={styles.option}>
							<form className={styles.createUserForm}>
								<div className={styles.inputBlock}>
									<label htmlFor="name-input">Name</label>
									<input
										id="name-input"
										name="name-input"
										type="text"
										value={state.inputName}
										onChange={e => dispatch({ type: 'name-change', payload: e.target.value })}
									/>
								</div>
								<div className={styles.inputBlock}>
									<label htmlFor="email-input">Email</label>
									<input
										id="email-input"
										name="email-input"
										type="text"
										className={styles.input}
										value={state.inputEmail}
										onChange={e => dispatch({ type: 'email-change', payload: e.target.value })}
									/>
								</div>
								<div className={styles.inputBlock}>
									<label htmlFor="password-input">Password</label>
									<div className={styles.inputField}>
										<input
											id="password-input"
											name="password-input"
											type="password"
											className={styles.input}
											value={state.inputPassword}
											onChange={e => dispatch({ type: 'password-change', payload: e.target.value })}
										/>
										<div className={styles.icon}>
											<FontAwesomeIcon icon={faEye} />
										</div>
									</div>
								</div>

								<button type="submit" className={styles.btn}>
									CREATE USER
								</button>
							</form>
						</div>
						<div className={styles.option}>GET ALL TASKS</div>
						<div className={styles.option}>GET TASKS BY USER ID</div>
						<div className={styles.option}>GET TASK BY ID</div>
					</div>
				)}
			</section>
		</section>
	);
};

export default AdminActions;

AdminActions.propTypes = {
	category: PropTypes.string,
	state: PropTypes.object,
	dispatch: PropTypes.func,
};
