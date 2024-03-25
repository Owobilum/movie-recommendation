import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.model';
import { Movie } from './movie.model';

@Entity()
class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({ type: 'decimal', precision: 10, scale: 1 })
  rating: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { Review };
