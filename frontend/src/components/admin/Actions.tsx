// React
import { useRef, useEffect } from 'react';

// Styles
import styles from './Actions.module.css';

// Types
import type { ActionsProps } from './../../types/prop.types';

const Actions = ({ selecting, onDispatch, children }: ActionsProps): JSX.Element => {
	const optionsRef = useRef<HTMLDivElement>(null);

	const handleToggle = (): void => onDispatch({ type: 'selecting-change', payload: true });

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent): void => {
			if (optionsRef.current && !optionsRef.current.contains(e.target as Node))
				onDispatch({ type: 'selecting-change', payload: false });
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [optionsRef, onDispatch]);

	return (
		<section className={styles.actions}>
			<button type="button" className={styles.toggle} onClick={handleToggle}>
				SELECT ACTION
			</button>
			{selecting && (
				<div className={styles.options} ref={optionsRef}>
					{children}
				</div>
			)}
		</section>
	);
};

export default Actions;
