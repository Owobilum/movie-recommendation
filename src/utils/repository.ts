import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { dataSource } from '../config/data-source';

export type ExtendRepositoryType<T extends ObjectLiteral> = Repository<T> & {
  paginate: (page?: number, pageSize?: number) => Promise<T[]>;
};

export const getExtendedRepository = <T extends ObjectLiteral>(
  model: EntityTarget<T>,
): ExtendRepositoryType<T> => {
  const repository = dataSource.getRepository(model);

  return repository.extend({
    async paginate(page = 1, pageSize = 10) {
      const skip = (page - 1) * pageSize;

      const items = await repository.find({
        skip,
        take: pageSize,
      });

      return items;
    },
  });
};
