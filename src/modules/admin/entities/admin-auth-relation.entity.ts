import { Admin } from './admin.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminAuthRelation {
  @PrimaryGeneratedColumn({ comment: '令牌ID' })
  id?: number;

  @ManyToOne(() => Admin, (admin) => admin.adminAuthRelations)
  admin?: Admin;

  @Column({ comment: '後台人員ID' })
  adminId?: number;

  @Column({ comment: '登入方式' })
  authType?: 'local' | 'third';
}
