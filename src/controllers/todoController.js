import connection from "../config/connect_db.js";
import utils from "../utils/utils.js";
import todoSchema from "../models/Todo.model.js";

// Get user todos it will use the query params to filter the todos
const getUserTodos = (req, res) => {
    try {
        // Get query params
        const params = req.query;
        // Set default values for query params
        if (params.todoRecycle === undefined) {
            params.todoRecycle = 0;
        }
        if (params.todoDone === undefined) {
            params.todoDone = 0;
        }

        // Get user details from auth middleware payload
        const userName = req.payload.aud;
        const sql = `SELECT * FROM ${userName}_todos WHERE todoRecycle = ${params.todoRecycle} AND todoDone = ${params.todoDone} ORDER BY id DESC`;
        connection.query(sql, (err, result) => {
            if (err) {
                utils.writeErrorToLog(err);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
                return;
            }

            res.status(200).json({
                status: "success",
                data: utils.convertToJSON(result)
            });

        })
    } catch (error) {
        utils.writeErrorToLog(error);
    }
}

// Add a new todo
const addTodo = (req, res) => {
    try {
        const userName = req.payload.aud;
        const sql = `INSERT INTO ${userName}_todos (todoTitle, todoStartDate) VALUES (?, ?)`;
        const todoTitle = {
            todoTitle: req.body.todoTitle.trim()
        }

        // Validate user input
        const { error } = todoSchema.validate(todoTitle);
        if (error) {
            // Write error to log file
            utils.writeErrorToLog(error);
            res.status(400).json({
                status: "error",
                message: "Please give a valid todo title"
            });
            return;
        }

        // Use current date in yyyy-mm-dd format
        const todoStartDate = new Date().toISOString().slice(0, 10);
        const values = [todoTitle.todoTitle, todoStartDate];

        connection.query(sql, values, (err, result) => {
            if (err) {
                utils.writeErrorToLog(err);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
                return;
            }

            res.status(200).json({
                status: "success",
                message: "Todo added successfully"
            });

        })
    } catch (error) {
        utils.writeErrorToLog(error);
    }
}

// Delete a todo
const deleteTodo = (req, res) => {
    try {
        const userName = req.payload.aud;
        const sql = `DELETE FROM ${userName}_todos WHERE id = ?`;
        const values = [req.params.id];

        connection.query(sql, values, (err, result) => {
            if (err) {
                utils.writeErrorToLog(err);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Not Found"
                });
                return;
            }

            res.status(200).json({
                status: "success",
                message: "Todo deleted successfully"
            });

        })
    }
    catch (error) {
        utils.writeErrorToLog(error);
    }
}

// Update a todo mark, recycle, important
const actionUpdateTodo = (req, res) => {
    try {
        // Taking the todo credentials
        const todoId = req.params.id;
        const { userAction, userValue } = req.body;
        const userName = req.payload.aud;
        let userSelection = "";

        // Check if the userValue is boolean or not if not than return an error
        if (typeof userValue !== "boolean") {
            res.status(400).json({
                status: "error",
                message: "Bad Request"
            });
            return;
        }

        // Check user action and set the userSelection
        switch (userAction) {
            case "mark":
                userSelection = "todoDone";
                break;
            case "recycle":
                userSelection = "todoRecycle";
                break;
            case "important":
                userSelection = "todoImp";
                break;
            default:
                res.status(400).json({
                    status: "error",
                    message: "Bad Request"
                });
                return;
        }


        // Set the query
        const sql = `UPDATE ${userName}_todos SET ${userSelection} = ? WHERE id = ?`;
        const values = [userValue, todoId];

        // Run the query
        connection.query(sql, values, (err, result) => {
            // Handle errors
            if (err) {
                utils.writeErrorToLog(err);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Not Found"
                });
                return;
            }

            // Return success message
            res.status(200).json({
                status: "success",
                message: "Todo updated successfully"
            });
        });
    } catch (error) {
        utils.writeErrorToLog(error);
    }
}

// Update a todo Title
const updateTodoTitle = (req, res) => {
    try {
        // Taking the todo credentials
        const todoId = req.params.id;
        const userName = req.payload.aud;
        const todoTitle = {
            todoTitle: req.body.todoTitle.trim()
        }

        // Validate user input
        const { error } = todoSchema.validate(todoTitle);
        if (error) {
            // Write error to log file
            utils.writeErrorToLog(error);
            res.status(400).json({
                status: "error",
                message: "Please give a valid todo title"
            });
            return;
        }

        // Set the query
        const sql = `UPDATE ${userName}_todos SET todoTitle = ? WHERE id = ?`;
        const values = [todoTitle.todoTitle, todoId];

        // Run the query
        connection.query(sql, values, (err, result) => {
            // Handle errors
            if (err) {
                utils.writeErrorToLog(err);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Not Found"
                });
                return;
            }

            // Return success message
            res.status(200).json({
                status: "success",
                message: "Todo updated successfully"
            });
        });
    } catch (error) {
        utils.writeErrorToLog(error);
    }
}

// Export the functions
export default {
    getUserTodos,
    addTodo,
    actionUpdateTodo,
    updateTodoTitle,
    deleteTodo
}