# Todo List APIs
This is a simple todo list API built with Node.js, Express, and SQL. It is a simple API that allows you to create, read, update, and delete todos. In this Project, I have to used the Recycle Bin to store the deleted todos.

# Installation MySQL and Redis
To install this project, you need to have MySQL and Redis installed on your computer. You can download MySQL from [here](https://www.mysql.com/downloads/). You can download Redis from [here](https://redis.io/download). But you can also install Redis using the following command:

```$ sudo apt-get install redis```

# Database Settings

After installing MySQL and Redis, you can create a database and a table for this project. You can use the following command to create a database:

## MySQL

```$ CREATE DATABASE todo_list;```
```$ USE todo_list;```

Then, you can use the following command to create a table:

```$ CREATE TABLE users (userName varchar(255) NOT NULL, fullName varchar(100) NOT NULL, userPassword varchar(255) NOT NULL, userEmail varchar(255) NOT NULL, isVerified boolean DEFAULT FALSE, PRIMARY KEY(userName), UNIQUE KEY `userName` (`userName`));```

## Redis
After installing Redis, you can start the Redis server by using the following command:

```$ redis-server```
```$ redis-cli```

In redis-cli, you can work with redis database. It's the command line interface for Redis. You can use the following command to check the redis server is running or not:

```$ ping```

If the redis server is running, you will get the following response:

```PONG```

But by the way it's not recommended to use the redis-cli for production. You can use the redis-cli for development purpose only.

## Redis Commnader
Redis commander is a web based UI for Redis. You can use the following command to install redis commander:

```$ npm install -g redis-commander```

After installing redis commander, you can start the redis commander by using the following command:

```$ redis-commander```

Then, you can open the browser and go to the following URL:

```http://localhost:8081```
or the port number you have set in the redis commander. But if mostly the redis commander prints the lik on the terminal. You can use the link to open the redis commander.

# Installation Node.js and npm
To install this project, you need to have Node.js and npm installed on your computer. You can download Node.js from [here](https://nodejs.org/en/download/). Most of the time, npm comes with Node.js. If not, you can download it from [here](https://www.npmjs.com/get-npm). If you are the Mac or Linux users and you have to install the npm separately. You can use the following command to install npm:

```$ sudo apt-get install npm```

After installing Node.js and npm, you can clone this repository by using the following command:

```$ git clone https://github.com/ahmad-junior/todo-apis.git```

# Installation Required Packages
After cloning the repository, you need to install the required packages. You can install the required packages by using the following command:

```$ npm install```

> **Note** : You need to be in the project directory to run the above command.

> **Important Note** : I can't commit the .env file because it contains the database credentials. So, you need to create a .env file in the project directory and add the following variables to it:

# Environment Variables
I have used the following environment variables in this project:

```PORT=_your_port_number_```

```DB_HOST=_your_db_host_```

```DB_USER=_your_db_user_```

```DB_PASSWORD=_your_db_password_```

```DB_NAME=_your_db_name_```

```SECRET_KEY_TOKEN=_your_secret_key_token_```

```SECRET_KEY_REFRESH=_your_secret_key_refresh_token```

```REDIS_HOST=_your_redis_host_```

```REDIS_PORT=_your_redis_port_```

```EXP_TOKEN=_your_exp_time_token_```

```EXP_REFRESH=_your_exp_time_refresh_token_```

```LOG_FILE_NAME=logs.log```

So, you need to add the above variables to the .env file. You can set any values to the variables. But, you need to use the same variable names in the .env file.

# Running the Project
After installing the required packages, you can run the project by using the following command:

```$ npm start```

or

```$ yarn dev```