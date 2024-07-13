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
  async create(req: AuthenticatedRequest, res: Response) {
    const { description, form_payment, date, id_category, type, value } = req.body;
    const userId = req.user.id;

    try {
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const category = await categoryRepository.findOneBy({ id: id_category });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
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
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { description, form_payment, date, id_category } = req.body;
    const userId = req.user.id;

    try {
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const category = await categoryRepository.findOneBy({ id: id_category });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
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
    } catch (error) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      // Ensure user owns the transaction before deleting
      const transaction = await transactionRepository.findOneBy({ id: parseInt(id) });
      if (!transaction || transaction.user.id !== userId) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      await transactionRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTransactionSummary(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
  
      const transactions = await transactionRepository.find({
        where: { user: { id: userId } }
      });
  
      // Calcula total de entrada e saída apenas para as transações do usuário
      const totalIncome = transactions
        .filter(transaction => transaction.type === 'entrada')
        .reduce((total, transaction) => total + parseFloat(transaction.value.toString()), 0); // Convertendo para string antes de parseFloat
  
      const totalExpense = transactions
        .filter(transaction => transaction.type === 'saida')
        .reduce((total, transaction) => total + parseFloat(transaction.value.toString()), 0); // Convertendo para string antes de parseFloat
  
      const currentBalance = totalIncome - totalExpense;
  
      // Verifica se os valores são números antes de formatá-los
      const formattedTotalIncome = typeof totalIncome === 'number' ? totalIncome.toFixed(2) : '0.00';
      const formattedTotalExpense = typeof totalExpense === 'number' ? totalExpense.toFixed(2) : '0.00';
      const formattedCurrentBalance = typeof currentBalance === 'number' ? currentBalance.toFixed(2) : '0.00';
  
      return res.status(200).json({
        totalIncome: formattedTotalIncome,
        totalExpense: formattedTotalExpense,
        currentBalance: formattedCurrentBalance
      });
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
