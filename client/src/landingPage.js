import React, { useState, useEffect } from 'react';

const LandingPage = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		const backendUrl = process.env.REACT_APP_BACKEND_URL;
		const endpoint = `${backendUrl}/api/id`;
		// Replace 'your-backend-endpoint' with your actual backend endpoint
		fetch(endpoint)
			.then(response => response.json())
			.then(data => setData(data))
			.catch(error => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="landing">
			<h1>Welcome to the Landing Page</h1>
			{data ? <p>ID: {data.id}</p> : <p>Loading...</p>}
			<button onClick={() => (window.location.href = '/todos')}>
				Go to Todos
			</button>
		</div>
	);
};

export default LandingPage;
