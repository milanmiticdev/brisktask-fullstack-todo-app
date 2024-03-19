// React
import { useReducer, useEffect, useContext, FormEvent } from 'react';

// Context
import AuthContext from '../../contexts/AuthContext';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/shared/Button';
import Form from '../../components/shared/Form';
import FormField from '../../components/shared/FormField';
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';
import Spinner from '../../components/shared/Spinner';

// Controllers
import taskController from '../../controllers/task.controller';

// Utils
import validators from '../../utils/validators';

// Types
import type { TaskType } from '../../types/server.types';
import type { UpdateTaskPageState, UpdateTaskPageAction } from './../../types/page.types';

// Initial reducer state
const initialState: UpdateTaskPageState = {
	result: {} as TaskType,
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducer function
const reducer = (state: UpdateTaskPageState, action: UpdateTaskPageAction): UpdateTaskPageState => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const UpdateTaskPage = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { token, userRole } = useContext(AuthContext);
	const { taskId } = useParams();
	const navigate = useNavigate();

	const { getTaskById, updateTaskById } = taskController;
	const { validateName } = validators;

	useEffect(() => {
		const handleGetTaskById = async () => await getTaskById({ taskId: Number(taskId), token, dispatch });
		handleGetTaskById();
	}, [taskId, token, getTaskById]);

	const handleUpdateTaskById = async (e: FormEvent<HTMLFormElement>) =>
		await updateTaskById({ taskId: Number(taskId), userRole, token, state, dispatch, navigate, e });

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && state.result && Object.keys(state.result).length > 0 && (
				<Form onSubmit={handleUpdateTaskById} heading="UPDATE TASK">
					<FormField
						name="name"
						type="text"
						initial={state.result.name}
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={true}
					/>
					<Button text="UPDATE" type="submit" color="blue" />
				</Form>
			)}
		</Page>
	);
};

export default UpdateTaskPage;
