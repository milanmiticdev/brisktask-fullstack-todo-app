// React
import { useRef, useEffect } from 'react';

// Styles
import styles from './Actions.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Actions = ({ selecting, onDispatch, children }) => {
	const optionsRef = useRef(null);

	const handleToggle = () => onDispatch({ type: 'selecting-change', payload: true });

	useEffect(() => {
		const handleClickOutside = e => {
			if (optionsRef.current && !optionsRef.current.contains(e.target)) onDispatch({ type: 'selecting-change', payload: false });
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

Actions.propTypes = {
	selecting: PropTypes.bool,
	onDispatch: PropTypes.func,
	children: PropTypes.node,
};
