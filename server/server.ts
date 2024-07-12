import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Sequelize, DataTypes, Model } from 'sequelize';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const DB_TYPE = process.env.DB_TYPE; // 'mongodb' or 'mysql'

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

//@ts-ignore
let Todo: any;

// MongoDB setup
if (DB_TYPE === 'mongodb') {
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

	Todo = mongoose.model('Todo', TodoSchema);
}

// MySQL setup
if (DB_TYPE === 'mysql') {
	const sequelize = new Sequelize(process.env.MYSQL_URL || '', {
		dialect: 'mysql',
		logging: false,
	});

	class TodoModel extends Model {
		public _id!: number;
		public text!: string;
	}

	TodoModel.init(
		{
			_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Todo',
			timestamps: false,
		},
	);

	sequelize
		.sync()
		.then(() => {
			console.log('Connected to MySQL and synchronized Todo model');
		})
		.catch((error: any) => {
			console.log('MySQL connection error:', error);
		});

	Todo = TodoModel;
}

// Create a new Todo
app.post('/api/todos', async (req: Request, res: Response) => {
	try {
		const todo =
			DB_TYPE === 'mongodb'
				? new Todo({ text: req.body.text })
				: await Todo.create({ text: req.body.text });
		if (DB_TYPE === 'mongodb') {
			await todo.save();
		}
		res.status(201).json(todo);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server error' });
	}
});

// Get all Todos
app.get('/api/todos', async (req: Request, res: Response) => {
	try {
		const todos =
			DB_TYPE === 'mongodb' ? await Todo.find() : await Todo.findAll();
		res.json(todos);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Update a Todo
app.put('/api/todos/:id', async (req: Request, res: Response) => {
	try {
		let todo;
		if (DB_TYPE === 'mongodb') {
			todo = await Todo.findById(req.params.id);
			if (!todo) {
				return res.status(404).json({ error: 'Todo not found' });
			}
			todo.text = req.body.text;
			await todo.save();
		} else {
			todo = await Todo.findByPk(req.params.id);
			if (!todo) {
				return res.status(404).json({ error: 'Todo not found' });
			}
			todo.text = req.body.text;
			await todo.save();
		}
		res.json(todo);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Delete a Todo
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
	try {
		let todo;
		if (DB_TYPE === 'mongodb') {
			todo = await Todo.findByIdAndRemove(req.params.id);
			if (!todo) {
				return res.status(404).json({ error: 'Todo not found' });
			}
		} else {
			todo = await Todo.findByPk(req.params.id);
			if (!todo) {
				return res.status(404).json({ error: 'Todo not found' });
			}
			await todo.destroy();
		}
		res.json({ message: 'Todo deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

// Endpoint to get environment ID
app.get('/api/id', (req: Request, res: Response) => {
	try {
		const envId = process.env.AWS_REGION || 'something unique';
		if (!envId) {
			return res.status(404).json({ error: 'Environment variable not found' });
		}
		res.json({ id: envId });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
