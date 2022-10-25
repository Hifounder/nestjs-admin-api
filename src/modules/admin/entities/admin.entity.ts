import { IsEnum, IsNumber } from 'class-validator';
import { Basic } from 'src/packages/utils/entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';
import { AdminProfile } from './admin-profile.entity';

export enum AdminStatus {
  BLOCK,
  DELETE,
  DISABLE,
  ENABLE,
}

@Entity()
export class Admin extends Basic {
  @OneToOne(() => AdminProfile)
  @JoinColumn()
  profile?: AdminProfile;

  @Column({ comment: '後台人員資料ID', nullable: true })
  @IsNumber()
  profileId?: number;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.DISABLE,
    comment: '狀態',
  })
  @IsEnum(AdminStatus)
  status: AdminStatus;

  @OneToMany(
    () => AdminAuthRelation,
    (adminAuthRelation) => adminAuthRelation.admin,
  )
  adminAuthRelations?: AdminAuthRelation[];
}
