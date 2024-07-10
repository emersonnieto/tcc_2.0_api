import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './Category';
import { User } from './User';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: ['dinheiro', 'debito', 'credito', 'pix', 'cheque'] })
  form_payment!: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'cheque';

  @Column()
  date!: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_category' })
  category!: Category;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user!: User;
}
