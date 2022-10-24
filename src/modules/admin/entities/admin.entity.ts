import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';
import { AdminProfile } from './admin-profile.entity';

export enum AdminStatus {
  BLOCK,
  DELETE,
  DISABLE,
  ENABLE,
}

@Entity()
export class Admin {
  @PrimaryGeneratedColumn({ comment: '後台人員ID' })
  id?: number;

  @OneToOne(() => AdminProfile)
  @JoinColumn()
  profile?: AdminProfile;

  @Column({ comment: '後台人員資料ID', nullable: true })
  profileId?: number;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.DISABLE,
    comment: '狀態',
  })
  status?: number;

  @OneToMany(
    () => AdminAuthRelation,
    (adminAuthRelation) => adminAuthRelation.admin,
  )
  adminAuthRelations?: AdminAuthRelation[];
}
