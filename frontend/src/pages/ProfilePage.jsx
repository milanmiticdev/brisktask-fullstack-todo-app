// React
import { useState, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

const ProfilePage = () => {
	const [user, setUser] = useState({});
	const { userId, token, logout } = useContext(AuthContext);

	const navigate = useNavigate();

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
		<section>
			{user && (
				<div>
					<p>Profile</p>
					<p>user ID: {user.id}</p>
					<p>email: {user.email}</p>
					<p>role: {user.role}</p>
					<button onClick={handleLogout}>LOGOUT</button>
				</div>
			)}
		</section>
	);
};

export default ProfilePage;
