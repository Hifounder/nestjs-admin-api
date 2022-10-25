import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

@Entity()
export class AdminProfile {
  @PrimaryGeneratedColumn({ comment: '後台人員資料ID' })
  id?: number;

  @OneToOne(() => Admin)
  @JoinColumn()
  admin?: Admin;

  @Column({ comment: '後台人員ID', nullable: true })
  adminId?: number;

  @Column({ comment: '名字' })
  @IsString()
  name?: string;
}
