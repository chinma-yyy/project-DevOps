// src/App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landingPage';
import TodoPage from './todoPage';

function App() {
	// ... (your existing code for fetching and managing todos)

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="" element={<LandingPage />} />
					<Route path="/todos" element={<TodoPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
