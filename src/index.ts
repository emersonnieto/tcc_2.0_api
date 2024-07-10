import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';

AppDataSource.initialize().then(async () => {
  const app = express();

  app.use(express.json());
  app.use('/api', userRoutes);
  app.use('/api', transactionRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => console.log(error));
