import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Movie } from './movie.model';
import { Genre } from './genre.model';
import { Actor } from './actor.model';
import { Director } from './director.model';
import { Studio } from './studio.model';

@Entity()
class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Movie)
  @JoinTable()
  watchlist: Movie[];

  @ManyToMany(() => Movie)
  @JoinTable()
  viewingHistory: Movie[];

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Actor)
  @JoinTable()
  favoriteCasts: Actor[];

  @ManyToMany(() => Director)
  @JoinTable()
  favoriteDirectors: Director[];

  @ManyToMany(() => Studio)
  @JoinTable()
  favoriteStudios: Studio[];
}

export { Profile };
