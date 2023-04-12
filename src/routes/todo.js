import Express from 'express';
import todoController from '../controllers/todoController.js';
const router = Express.Router();

// Get all todos of a user
router.get('/todos', todoController.getUserTodos);
router.post('/todos/add', todoController.addTodo);
router.put('/todos/actionUpdate/:id', todoController.actionUpdateTodo);
router.put('/todos/update/:id', todoController.updateTodoTitle);
router.delete('/todos/delete/:id', todoController.deleteTodo);

export default router;