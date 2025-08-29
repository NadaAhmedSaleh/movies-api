import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseTimestampEntity } from 'src/common/entities/BaseTimestampEntity';

@Entity('users')
export class User extends BaseTimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;
}
