import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/users', userController.create);
userRoutes.post('/users/login', userController.login); 
userRoutes.put('/users/:id', userController.update);
userRoutes.delete('/users/:id', userController.delete);

export default userRoutes;