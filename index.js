// Importing the required modules
import { createServer } from 'http';
import Express from 'express';
import Cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

// Importing the routes
import accountRoutes from './src/routes/account.js';
import todoRoutes from './src/routes/todo.js';

// Database connections
import './src/config/connect_db.js'
import './src/config/connect_redis.js'

// Setting up the PORT
const PORT = 3000 || process.env.PORT;

// Initializing the Express app
const app = Express();

// Setting up the middlewares
app.use(Express.json());
app.use(Cors());
app.use(morgan('dev'));

// Setting up the routes
app.use('/api', accountRoutes);
app.use('/api', todoRoutes);

// Setting up the server
const server = createServer(app);

// Setting up the server listener
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
