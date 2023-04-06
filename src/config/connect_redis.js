// Importing Required Modules
import redis from 'redis';


const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

client.connect();


// Events
client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.log(`Something went wrong ${err}`);
});

export default client;