import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';
import { Category } from '../entities/Category';

const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);

export class TransactionController {
  async create(req: Request, res: Response) {
    const { description, form_payment, date, id_category, id_user } = req.body;
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
}
