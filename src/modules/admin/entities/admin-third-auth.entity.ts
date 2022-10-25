import { IsNumber, IsString } from 'class-validator';
import { Basic } from 'src/packages/utils/entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';

@Entity()
export class AdminThirdAuth extends Basic {
  @Column({ comment: '三方公開ID' })
  openId?: string;

  @Column({ comment: '登入方式' })
  loginType?: string;

  @Column({ comment: '訪問令牌' })
  @IsString()
  access_token?: string;

  @OneToOne(() => AdminAuthRelation)
  @JoinColumn()
  auth?: AdminAuthRelation;

  @Column({ comment: '令牌ID', nullable: true })
  @IsNumber()
  authId?: number;
}
