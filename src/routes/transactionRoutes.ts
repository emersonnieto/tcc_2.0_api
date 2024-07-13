import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import authMiddleware from '../middlewares/authMiddleware';
import { AuthenticatedRequest } from '../middlewares/AuthenticatedRequest';

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.post('/transactions', authMiddleware, async (req, res) => {
  await transactionController.create(req, res);
});

transactionRoutes.put('/transactions/:id', authMiddleware, async (req, res) => {
  await transactionController.update(req, res);
});

transactionRoutes.delete('/transactions/:id', authMiddleware, async (req, res) => {
  await transactionController.delete(req, res);
});

transactionRoutes.get('/transactions/summary', authMiddleware, async (req, res) => {
  await transactionController.getTransactionSummary(req as AuthenticatedRequest, res);
});

export default transactionRoutes;
