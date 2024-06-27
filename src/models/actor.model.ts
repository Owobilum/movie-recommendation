import { Entity } from 'typeorm';

import { Professional } from './professional.model';

@Entity('actor')
class Actor extends Professional {}

export { Actor };
