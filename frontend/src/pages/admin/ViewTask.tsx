// React
import { useReducer, useEffect, useContext, FormEvent } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from '../../contexts/AuthContext';

// Components
import Button from '../../components/shared/Button';
import Form from '../../components/shared/Form';
import FormButtons from '../../components/shared/FormButtons';
import FormField from '../../components/shared/FormField';
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';
import Section from '../../components/shared/Section';
import Spinner from '../../components/shared/Spinner';

// Controllers
import taskController from '../../controllers/task.controller';

// Utils
import validators from '../../utils/validators';
import UTCtoLocal from '../../utils/UTCtoLocal';

// Types
import type { TaskType } from '../../types/server.types';
import type { ViewTaskPageState, ViewTaskPageAction } from './../../types/page.types';

// Initial reducer state
const initialState: ViewTaskPageState = {
	result: {} as TaskType,
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	editing: false,
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state: ViewTaskPageState, action: ViewTaskPageAction): ViewTaskPageState => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'editing-change':
			return { ...state, editing: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const ViewTask = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userRole, token } = useContext(AuthContext);
	const { taskId } = useParams();
	const navigate = useNavigate();

	const { getTaskById, updateTaskById, deleteTaskById } = taskController;
	const { validateName } = validators;

	const handleEditBtn = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: true });
	};
	const handleCancelBtn = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: false });
	};

	const handleUpdateTaskById = async (e: FormEvent<HTMLFormElement>) =>
		await updateTaskById({ taskId: Number(taskId), userRole, token, state, dispatch, navigate, e });
	const handleDeleteTaskById = async (e: FormEvent<HTMLFormElement>) =>
		await deleteTaskById({ taskId: Number(taskId), userRole, token, dispatch, navigate, e });

	useEffect(() => {
		const handleGetTaskById = async () => await getTaskById({ taskId: Number(taskId), token, dispatch });
		handleGetTaskById();
	}, [taskId, token, dispatch, getTaskById]);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && state.result && Object.keys(state.result).length > 0 && (
				<>
					<Section>
						<Form onSubmit={handleUpdateTaskById} heading="TASK INFO">
							<FormField
								name="name"
								type="text"
								initial={state.result.name}
								fieldChange="name-field-change"
								onDispatch={dispatch}
								onValidate={validateName}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField name="creator" type="text" initial={state.result.userEmail} readOnly={true} autoFocus={false} />
							<FormField
								name="created"
								type="text"
								initial={`${UTCtoLocal(state.result.createdAt).date} ${UTCtoLocal(state.result.createdAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							<FormField
								name="updated"
								type="text"
								initial={`${UTCtoLocal(state.result.updatedAt).date} ${UTCtoLocal(state.result.updatedAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							{state.editing ? (
								<FormButtons>
									<Button text="SAVE" type="submit" color="blue" />
									<Button text="X" type="button" color="red" onClick={handleCancelBtn} />
								</FormButtons>
							) : (
								<Button text="EDIT" type="button" color="gray" onClick={handleEditBtn} />
							)}
						</Form>
					</Section>
					<Section>
						<Form onSubmit={handleDeleteTaskById} heading="DELETE TASK">
							<Button text="DELETE" type="submit" color="red" />
						</Form>
					</Section>
				</>
			)}
		</Page>
	);
};

export default ViewTask;
