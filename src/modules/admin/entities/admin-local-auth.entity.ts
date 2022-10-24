import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';

@Entity()
export class AdminLocalAuth {
  @PrimaryGeneratedColumn({ comment: '一般登入ID' })
  id?: number;

  @Column({ comment: '後台帳號' })
  account?: string;

  @Column({ comment: '後台密碼', select: false })
  password?: string;

  @OneToOne(() => AdminAuthRelation)
  @JoinColumn()
  auth?: AdminAuthRelation;

  @Column({ comment: '令牌ID', nullable: true })
  authId?: string;
}
