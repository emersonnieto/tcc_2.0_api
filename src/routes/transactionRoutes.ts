import { Router, Request, Response } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import authMiddleware from '../middlewares/authMiddleware';
import { AuthenticatedRequest } from '../middlewares/AuthenticatedRequest'; // Verifique o caminho correto para AuthenticatedRequest

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.post('/transactions', authMiddleware, async (req: Request, res: Response) => {
  await transactionController.create(req as AuthenticatedRequest, res);
});

transactionRoutes.put('/transactions/:id', authMiddleware, async (req: Request, res: Response) => {
  await transactionController.update(req as AuthenticatedRequest, res);
});

transactionRoutes.delete('/transactions/:id', authMiddleware, async (req: Request, res: Response) => {
  await transactionController.delete(req as AuthenticatedRequest, res);
});

transactionRoutes.get('/transactions/summary', authMiddleware, async (req: Request, res: Response) => {
  await transactionController.getTransactionSummary(req as AuthenticatedRequest, res);
});

export default transactionRoutes;
