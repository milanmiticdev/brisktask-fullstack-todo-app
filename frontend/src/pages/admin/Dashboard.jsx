//React
import { useReducer, useRef, useEffect, useContext } from 'react';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// Controllers
import userController from './../../controllers/user.controller.js';
import taskController from './../../controllers/task.controller.js';

// Components
import Actions from './../../components/admin/Actions.jsx';
import ActionsOption from './../../components/admin/ActionsOption.jsx';
import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';
import Spinner from './../../components/shared/Spinner.jsx';
import Table from './../../components/admin/Table.jsx';

const initialState = {
	result: null,
	idForUserById: null,
	idForTaskById: null,
	idForTasksByUserId: null,
	loading: false,
	error: false,
	selecting: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'id-for-user-by-id-change':
			return { ...state, idForUserById: action.payload };
		case 'id-for-task-by-id-change':
			return { ...state, idForTaskById: action.payload };
		case 'id-for-tasks-by-user-id-change':
			return { ...state, idForTasksByUserId: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'selecting-change':
			return { ...state, selecting: action.payload };
		case 'spinner-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const Dashboard = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const selectRef = useRef(null);

	const { token } = useContext(AuthContext);

	const { getAllUsers, getUserById } = userController;
	const { getAllTasks, getTasksByUserId, getTaskById } = taskController;

	// Fetch users
	const handleGetAllUsers = async e => {
		await getAllUsers(token, dispatch, e);
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetUserById = async e => {
		await getUserById(state.idForUserById, token, dispatch, e);
		dispatch({ type: 'selecting-change', payload: false });
	};

	// Fetch tasks
	const handleGetAllTasks = async e => {
		await getAllTasks(token, dispatch, e);
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetTasksByUserId = async e => {
		await getTasksByUserId(state.idForTasksByUserId, token, dispatch, e);
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetTaskById = async e => {
		await getTaskById(state.idForTaskById, token, dispatch, e);
		dispatch({ type: 'selecting-change', payload: false });
	};

	useEffect(() => {
		const handleClickOutside = e => {
			if (selectRef.current && !selectRef.current.contains(e.target)) dispatch({ type: 'selecting-change', payload: false });
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [selectRef]);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && (
				<Actions selecting={state.selecting} onDispatch={dispatch}>
					<ActionsOption text="GET ALL USERS" onSubmit={handleGetAllUsers} input={false} />
					<ActionsOption text="GET ALL TASKS" onSubmit={handleGetAllTasks} input={false} />
					<ActionsOption text="CREATE USER" input={false} />
					<ActionsOption
						text="GET USER BY ID"
						onSubmit={handleGetUserById}
						onDispatch={dispatch}
						input={true}
						fieldChange="id-for-user-by-id-change"
					/>
					<ActionsOption
						text="GET TASK BY ID"
						onSubmit={handleGetTaskById}
						onDispatch={dispatch}
						input={true}
						fieldChange="id-for-task-by-id-change"
					/>
					<ActionsOption
						text="GET TASKS BY USER ID"
						onSubmit={handleGetTasksByUserId}
						onDispatch={dispatch}
						input={true}
						fieldChange="id-for-tasks-by-user-id-change"
					/>
				</Actions>
			)}
			{!state.loading && !state.error && state.result && <Table result={state.result} />}
		</Page>
	);
};

export default Dashboard;
