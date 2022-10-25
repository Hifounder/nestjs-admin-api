import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Basic {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ comment: '建立時間', default: () => 'CURRENT_TIMESTAMP' })
  createTime?: Date;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新時間',
  })
  updateTime?: Date;
}
