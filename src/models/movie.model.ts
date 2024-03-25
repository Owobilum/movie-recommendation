import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsDateString } from 'class-validator';

import { Actor } from './actor.model';
import { Director } from './director.model';
import { Genre } from './genre.model';
import { Review } from './review.model';
import { Studio } from './studio.model';

enum MOVIE_RELATIONSHIPS {
  DIRECTOR = 'director',
  GENRE = 'genre',
  CAST = 'cast',
  REVIEWS = 'reviews',
  STUDIO = 'studio',
}

@Entity()
class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 50)
  title: string;

  @Column()
  @IsDateString(undefined, {
    message: 'Release date must be in YYYY-MM-DD format',
  })
  releaseDate: string;

  @Column({ nullable: true })
  sourceMaterial: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Actor)
  @JoinTable()
  [MOVIE_RELATIONSHIPS.CAST]: Actor[];

  @ManyToMany(() => Genre)
  @JoinTable()
  [MOVIE_RELATIONSHIPS.GENRE]: Genre[];

  @ManyToOne(() => Director, (director) => director.movies)
  [MOVIE_RELATIONSHIPS.DIRECTOR]: Director;

  @OneToMany(() => Review, (review) => review.movie)
  [MOVIE_RELATIONSHIPS.REVIEWS]: Review[];

  @ManyToOne(() => Studio, (studio) => studio.movies)
  [MOVIE_RELATIONSHIPS.STUDIO]: Studio;
}

export { Movie, MOVIE_RELATIONSHIPS };
