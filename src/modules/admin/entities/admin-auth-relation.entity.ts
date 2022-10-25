import { Admin } from './admin.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsNumber } from 'class-validator';

export enum AuthType {
  local = 'local',
  third = 'third',
}
@Entity()
export class AdminAuthRelation {
  @PrimaryGeneratedColumn({ comment: '令牌ID' })
  id?: number;

  @ManyToOne(() => Admin, (admin) => admin.adminAuthRelations)
  admin?: Admin;

  @Column({ comment: '後台人員ID' })
  @IsNumber()
  adminId?: number;

  @Column({ comment: '登入方式' })
  @IsEnum(AuthType)
  authType?: AuthType;
}
