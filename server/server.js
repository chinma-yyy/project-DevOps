const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to mongoDB');
	});

const TodoSchema = new mongoose.Schema({
	text: String,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(cors());
app.use(bodyParser.json());

// Create a new Todo
app.post('/api/todos', async (req, res) => {
	try {
		const todo = new Todo({ text: req.body.text });
		await todo.save();
		res.status(201).json(todo);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Get all Todos
app.get('/api/todos', async (req, res) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Update a Todo
app.put('/api/todos/:id', async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);
		if (!todo) {
			return res.status(404).json({ error: 'Todo not found' });
		}
		todo.text = req.body.text;
		await todo.save();
		res.json(todo);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Delete a Todo
app.delete('/api/todos/:id', async (req, res) => {
	try {
		const todo = await Todo.findByIdAndRemove(req.params.id);
		if (!todo) {
			return res.status(404).json({ error: 'Todo not found' });
		}
		res.json({ message: 'Todo deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
