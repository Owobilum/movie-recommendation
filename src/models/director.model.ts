import { Entity, OneToMany } from 'typeorm';

import { Professional } from './professional.model';
import { Movie } from './movie.model';

@Entity()
class Director extends Professional {
  @OneToMany(() => Movie, (movie) => movie.director)
  movies: Movie[];
}

export { Director };
