import React, { useState, useEffect } from 'react';

const LandingPage = () => {
	const [data, setData] = useState(null);
	const backendUrl = process.env.REACT_APP_BACKEND_URL;

	useEffect(() => {
		const endpoint = `${backendUrl}/api/id`;
		fetch(endpoint)
			.then((response) => response.json())
			.then((data) => setData(data))
			.catch((error) => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="landing">
			<h1>Welcome to the Landing Page</h1>
			{data ? <p>ID: {data.id}</p> : <p>Loading...</p>}
			<button onClick={() => (window.location.href = '/todos')}>
				Go to Todos
			</button>
			<div> </div>
			<img
				src="https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"
				alt="Landing"
			/>
		</div>
	);
};

export default LandingPage;
