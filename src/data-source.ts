import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Category } from './entities/Category';
import { Transaction } from './entities/Transaction';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '19930926',
  database: 'ff_db',
  synchronize: true,
  logging: false,
  entities: [User, Category, Transaction],
  migrations: [],
  subscribers: [],
});
