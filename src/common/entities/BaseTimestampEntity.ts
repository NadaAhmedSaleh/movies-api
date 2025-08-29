import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimestampEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
