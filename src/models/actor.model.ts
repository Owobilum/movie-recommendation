import { Entity } from 'typeorm';

import { Professional } from './professional.model';

@Entity()
class Actor extends Professional {}

export { Actor };
