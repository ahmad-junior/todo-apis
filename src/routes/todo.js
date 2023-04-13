import Express from 'express';
import todoController from '../controllers/todoController.js';
import auth from "../middlewares/auth.middle.js";
const router = Express.Router();

// Use auth middleware to protect routes
router.use(auth);

// Get all todos of a user
router.get('/todos', todoController.getUserTodos);
router.post('/todos/add', todoController.addTodo);
router.put('/todos/actionUpdate/:id', todoController.actionUpdateTodo);
router.put('/todos/update/:id', todoController.updateTodoTitle);
router.delete('/todos/delete/:id', todoController.deleteTodo);

export default router;