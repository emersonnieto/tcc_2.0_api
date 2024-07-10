import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.post('/transactions', transactionController.create);
transactionRoutes.put('/transactions/:id', transactionController.update);
transactionRoutes.delete('/transactions/:id', transactionController.delete);

export default transactionRoutes;
