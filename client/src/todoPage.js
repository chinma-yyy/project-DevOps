// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function TodoPage() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');
	const [editingTodo, setEditingTodo] = useState(null);
	const [editText, setEditText] = useState('');

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/todos');
			setTodos(response.data);
		} catch (error) {
			console.error('Error fetching Todos:', error);
		}
	};

	const addTodo = async () => {
		if (input.trim() !== '') {
			try {
				const response = await axios.post('http://localhost:5000/api/todos', {
					text: input,
				});
				setTodos([...todos, response.data]);
				setInput('');
			} catch (error) {
				console.error('Error adding Todo:', error);
			}
		}
	};

	const startEditingTodo = (id, text) => {
		setEditingTodo(id);
		setEditText(text);
	};

	const cancelEditingTodo = () => {
		setEditingTodo(null);
		setEditText('');
	};

	const editTodo = async (id, newText) => {
		try {
			await axios.put(`http://localhost:5000/api/todos/${id}`, {
				text: newText,
			});
			const updatedTodos = todos.map((todo) =>
				todo._id === id ? { ...todo, text: newText } : todo,
			);
			setTodos(updatedTodos);
			setEditingTodo(null);
		} catch (error) {
			console.error('Error updating Todo:', error);
		}
	};

	const deleteTodo = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/todos/${id}`);
			setTodos(todos.filter((todo) => todo._id !== id));
		} catch (error) {
			console.error('Error deleting Todo:', error);
		}
	};

	return (
		<div className="App">
			<h1>Todo App</h1>
			<div className="todo-form">
				<input
					type="text"
					placeholder="Add a new Todo"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button onClick={addTodo}>Add</button>
			</div>
			<ul>
				{todos.map((todo) => (
					<li key={todo._id}>
						{editingTodo === todo._id ? (
							<div>
								<input
									type="text"
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
								/>
								<button onClick={() => editTodo(todo._id, editText)}>
									Save
								</button>
								<button onClick={cancelEditingTodo}>Cancel</button>
							</div>
						) : (
							<div>
								{todo.text}
								<button onClick={() => startEditingTodo(todo._id, todo.text)}>
									Edit
								</button>
								<button onClick={() => deleteTodo(todo._id)}>Delete</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoPage;
