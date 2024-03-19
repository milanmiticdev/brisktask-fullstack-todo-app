import { Dispatch, FormEvent, HTMLInputTypeAttribute, ReactNode, SetStateAction } from 'react';

import type { UserType, TaskType } from './server.types';
import type { Validation } from './util.types';

export interface ActionsProps {
	selecting: boolean;
	onDispatch: Dispatch<any>;
	children: ReactNode;
}

export interface ActionsOptionsProps {
	text: string;
	input: boolean;
	onDispatch?: Dispatch<any>;
	onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	fieldChange?: string;
}

export interface ButtonProps {
	text: string;
	type?: 'submit' | 'reset' | 'button' | undefined;
	color: string;
	onClick?: (e: any) => void;
}

export interface DropdownProps {
	setShowDropdown: Dispatch<SetStateAction<boolean>>;
}

export interface FormProps {
	heading?: string;
	children: ReactNode;
	onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface FormButtonsProps {
	children: React.ReactNode;
}

export interface FormFieldProps {
	name?: string;
	type?: HTMLInputTypeAttribute;
	initial?: string;
	onDispatch?: Dispatch<any>;
	fieldChange?: string;
	onValidate?: (input: string) => Validation;
	section?: string;
	readOnly?: boolean;
	autoFocus?: boolean;
}

export interface MessageProps {
	message: string;
}

export interface ModalProps {
	modal: {
		open: boolean;
		error: boolean;
		message: string;
	};
	onDispatch: Dispatch<any>;
}

export interface PageProps {
	center: boolean;
	children: ReactNode;
}

export interface PulseEffectProps {
	text: string;
}

export interface SectionProps {
	children: ReactNode;
}

export interface SpinnerProps {
	text: string;
}

export interface TabProps {
	section: string;
	onDispatch: Dispatch<any>;
	type: string;
	payload: string;
	position: string;
	text: string;
}

export interface TabsToggleProps {
	children: ReactNode;
}

export interface TableProps {
	result: UserType | UserType[] | TaskType | TaskType[];
}

export interface TableRowProps {
	parent: string;
	section: string;
	id?: number;
	email?: string;
}

export interface TaskProps {
	task: TaskType;
	onDispatch: Dispatch<any>;
}
