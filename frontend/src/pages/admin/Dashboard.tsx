//React
import { useReducer, useRef, useEffect, useContext, FormEvent } from 'react';

// Context
import AuthContext from '../../contexts/AuthContext';

// Controllers
import userController from '../../controllers/user.controller';
import taskController from '../../controllers/task.controller';

// Components
import Actions from '../../components/admin/Actions';
import ActionsOption from '../../components/admin/ActionsOption';
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';
import Spinner from '../../components/shared/Spinner';
import Table from '../../components/admin/Table';

// Types
import type { DashboardPageState, DashboardPageAction } from './../../types/page.types';

const initialState: DashboardPageState = {
	result: null,
	idForUserById: 0,
	idForTaskById: 0,
	idForTasksByUserId: 0,
	selecting: false,
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

const reducer = (state: DashboardPageState, action: DashboardPageAction): DashboardPageState => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'id-for-user-by-id-change':
			return { ...state, idForUserById: action.payload };
		case 'id-for-task-by-id-change':
			return { ...state, idForTaskById: action.payload };
		case 'id-for-tasks-by-user-id-change':
			return { ...state, idForTasksByUserId: action.payload };
		case 'selecting-change':
			return { ...state, selecting: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const Dashboard = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const selectRef = useRef<HTMLDivElement>(null);

	const { token } = useContext(AuthContext);

	const { getAllUsers, getUserById } = userController;
	const { getAllTasks, getTasksByUserId, getTaskById } = taskController;

	// Fetch users
	const handleGetAllUsers = async (e: FormEvent<HTMLFormElement>) => {
		await getAllUsers({ token, dispatch, e });
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetUserById = async (e: FormEvent<HTMLFormElement>) => {
		await getUserById({ userId: state.idForUserById, token, dispatch, e });
		dispatch({ type: 'selecting-change', payload: false });
	};

	// Fetch tasks
	const handleGetAllTasks = async (e: FormEvent<HTMLFormElement>) => {
		await getAllTasks({ token, dispatch, e });
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetTasksByUserId = async (e: FormEvent<HTMLFormElement>) => {
		await getTasksByUserId({ userId: state.idForTasksByUserId, token, dispatch, e });
		dispatch({ type: 'selecting-change', payload: false });
	};
	const handleGetTaskById = async (e: FormEvent<HTMLFormElement>) => {
		await getTaskById({ taskId: state.idForTaskById, token, dispatch, e });
		dispatch({ type: 'selecting-change', payload: false });
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(e.target as Node)) dispatch({ type: 'selecting-change', payload: false });
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [selectRef]);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
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
			{!state.loading && state.result && <Table result={state.result} />}
		</Page>
	);
};

export default Dashboard;
