import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/register', async (req, res) => {
  await userController.create(req, res);
});

userRoutes.post('/login', async (req, res) => {
  await userController.login(req, res);
});

userRoutes.put('/users/:id', authMiddleware, async (req, res) => {
  await userController.update(req, res);
});

userRoutes.delete('/users/:id', authMiddleware, async (req, res) => {
  await userController.delete(req, res);
});

export default userRoutes;
