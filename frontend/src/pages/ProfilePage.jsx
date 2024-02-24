// React
import { useState, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Utils
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
	const [user, setUser] = useState({});
	const { userId, token, logout } = useContext(AuthContext);

	const navigate = useNavigate();

	const local = UTCtoLocal(user.createdAt);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	useEffect(() => {
		const getUser = async () => {
			if (token && userId) {
				try {
					const response = await fetch(`http://localhost:5174/api/v1/users/${userId}`, {
						method: 'GET',
						body: null,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					const data = await response.json();

					setUser(data.user);
				} catch {
					console.log('Something went wrong.');
				}
			}
		};
		getUser();
	}, [userId, token]);

	return (
		<section className={styles.profile}>
			{user && (
				<div className={styles.info}>
					<p>
						<span className={styles.span}>NAME:</span> {user.name}
					</p>
					<p>
						<span className={styles.span}>EMAIL:</span> {user.email}
					</p>
					<p>
						<span className={styles.span}>ROLE:</span> {user.role}
					</p>
					<p>
						<span className={styles.span}>REGISTERED:</span> {`${local.date} ${local.time}`}
					</p>
					<button className={styles.logout} onClick={handleLogout}>
						LOGOUT
					</button>
				</div>
			)}
		</section>
	);
};

export default ProfilePage;
