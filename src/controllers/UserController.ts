import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = 'your_jwt_secret';

export class UserController {
  async create(req: Request, res: Response) {
    const { name, last_name, email, password } = req.body;

    try {
      // Verificar se o usuário já existe
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash da senha antes de salvar no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({ name, last_name, email, password: hashedPassword });
      await userRepository.save(user);

      // Gerar token JWT para a sessão do usuário
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      // Encontrar usuário pelo email
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Gerar token JWT para a sessão do usuário
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, last_name, email, password } = req.body;

    try {
      // Hash da senha antes de atualizar
      const hashedPassword = await bcrypt.hash(password, 10);
      await userRepository.update(id, { name, last_name, email, password: hashedPassword });
      const updatedUser = await userRepository.findOne({ where: { id: parseInt(id, 10) } });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await userRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
