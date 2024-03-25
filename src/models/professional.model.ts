import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Length } from 'class-validator';

@Entity()
class Professional extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 50)
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { Professional };
