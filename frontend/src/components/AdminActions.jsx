//React
import { useRef, useEffect, useContext } from 'react';

// Context
import AuthContext from '../contexts/AuthContext.js';

// Components
import SelectBtn from './SelectBtn.jsx';
import SelectOption from './SelectOption.jsx';

// Styles
import styles from './AdminActions.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActions = ({ category, isSelecting, dispatch }) => {
	const selectRef = useRef(null);

	const { token } = useContext(AuthContext);

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

	const getAll = async () => {
		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Loading' });

			const response = await fetch(`http://localhost:5174/api/v1/${category}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: null,
			});
			const data = await response.json();

			if (data.status === 200) {
				dispatch({ type: 'show-table', payload: true });
				dispatch({ type: 'result-fetched', payload: data[category] });
			} else {
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
				dispatch({ type: 'show-table', payload: false });
			}
		} catch {
			dispatch({ type: 'show-table', payload: false });
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'category-change', payload: category });
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'is-selecting', payload: false });
		}
	};

	return (
		<section className={styles.selection}>
			{category === 'users' ? (
				<SelectBtn text="SELECT USER ACTION" dispatch={dispatch} />
			) : (
				<SelectBtn text="SELECT TASK ACTION" dispatch={dispatch} />
			)}
			{isSelecting && (
				<div className={styles.actions} ref={selectRef}>
					<SelectOption text={category === 'users' ? 'GET ALL USERS' : 'GET ALL TASKS'} dispatch={dispatch} onClick={getAll} />
					{category === 'tasks' && <SelectOption text="GET TASKS BY USER" dispatch={dispatch} />}
					<SelectOption text={category === 'users' ? 'GET SINGLE USER' : 'GET SINGLE TASK'} dispatch={dispatch} />
					{category === 'users' && <SelectOption text="CREATE USER" dispatch={dispatch} />}
				</div>
			)}
		</section>
	);
};

export default AdminActions;

AdminActions.propTypes = {
	category: PropTypes.string,
	isSelecting: PropTypes.bool,
	dispatch: PropTypes.func,
};
