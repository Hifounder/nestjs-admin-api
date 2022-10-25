import { IsNumber, IsString } from 'class-validator';
import { Basic } from 'src/packages/utils/entity';
import { MD5 } from 'src/packages/utils/utils';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AdminAuthRelation } from './admin-auth-relation.entity';

@Entity()
export class AdminLocalAuth extends Basic {
  @Column({ comment: '後台帳號' })
  @IsString()
  account?: string;

  @Column({ comment: '後台密碼', select: false })
  @IsString()
  password?: string;

  @OneToOne(() => AdminAuthRelation)
  @JoinColumn()
  auth?: AdminAuthRelation;

  @Column({ comment: '令牌ID', nullable: true })
  @IsNumber()
  authId?: string;

  @BeforeInsert()
  protected async listenInsert?() {
    this.password = MD5(this.password);
  }
}
