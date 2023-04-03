// Importing the required modules
import { createServer } from 'http';
import 'dotenv/config';
import Express from 'express';

// Setting up the PORT
const PORT = 3000 || process.env.PORT;

// Initializing the Express app
const app = Express();

// Setting up the server
const server = createServer(app);

// Setting up the server listener
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
