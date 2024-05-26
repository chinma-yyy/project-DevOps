import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// MongoDB Connection
mongoose
	.connect(process.env.MONGODB_URL || '')
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.log('MongoDB connection error:', error);
	});

const TodoSchema = new mongoose.Schema({
	text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Create a new Todo
app.post('/api/todos', async (req: Request, res: Response) => {
	try {
		const todo = new Todo({ text: req.body.text });
		await todo.save();
		res.status(201).json(todo);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Get all Todos
app.get('/api/todos', async (req: Request, res: Response) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Update a Todo
app.put('/api/todos/:id', async (req: Request, res: Response) => {
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
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
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
