import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { AuthenticatedRequest } from '../middlewares/AuthenticatedRequest';

const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);

export class TransactionController {
  async create(req: Request, res: Response) {
    const { description, form_payment, date, id_category, id_user, type, value } = req.body;
    const user = await userRepository.findOneBy({ id: id_user });
    const category = await categoryRepository.findOneBy({ id: id_category });

    if (!user || !category) {
      return res.status(404).json({ message: 'User or Category not found' });
    }

    const transaction = transactionRepository.create({
      description,
      form_payment,
      date,
      user,
      category,
      type,
      value
    });

    await transactionRepository.save(transaction);
    return res.status(201).json(transaction);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { description, form_payment, date, id_category, id_user } = req.body;
    const user = await userRepository.findOneBy({ id: id_user });
    const category = await categoryRepository.findOneBy({ id: id_category });

    if (!user || !category) {
      return res.status(404).json({ message: 'User or Category not found' });
    }

    await transactionRepository.update(id, {
      description,
      form_payment,
      date,
      user,
      category,
    });

    const updatedTransaction = await transactionRepository.findOneBy({ id: parseInt(id) });
    return res.status(200).json(updatedTransaction);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await transactionRepository.delete(id);
    return res.status(204).send();
  }

  async getTransactionSummary(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id; // Obtém o ID do usuário logado

      // Consulta todas as transações do usuário logado
      const transactions = await transactionRepository.find({
        where: { user: { id: userId } }
      });

      // Calcula total de entrada e saída apenas para as transações do usuário
      const totalIncome = transactions
        .filter(transaction => transaction.type === 'entrada')
        .reduce((total, transaction) => total + parseFloat(transaction.value.toString()), 0);

      const totalExpense = transactions
        .filter(transaction => transaction.type === 'saida')
        .reduce((total, transaction) => total + parseFloat(transaction.value.toString()), 0);

      const currentBalance = totalIncome - totalExpense;

      return res.status(200).json({
        totalIncome,
        totalExpense,
        currentBalance
      });
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
