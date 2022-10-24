import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';

@Entity()
export class AdminThirdAuth {
  @PrimaryGeneratedColumn({ comment: '三方登入ID' })
  id?: number;

  @Column({ comment: '三方公開ID' })
  openId?: string;

  @Column({ comment: '登入方式' })
  loginType?: string;

  @Column({ comment: '訪問令牌' })
  access_token?: string;

  @OneToOne(() => AdminAuthRelation)
  @JoinColumn()
  auth?: AdminAuthRelation;

  @Column({ comment: '令牌ID', nullable: true })
  authId?: string;
}
