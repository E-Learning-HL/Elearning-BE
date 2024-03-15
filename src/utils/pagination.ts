import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { IPaginationOptions } from './types/pagination-options';
import { PaginationResultType } from './types/pagination-result.type';
import { Logger } from '@nestjs/common';

export type FindOptions<T> = FindOneOptions<T>;
export async function paginate<Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  paginationOption: IPaginationOptions,
  options?: FindOptions<Entity>,
): Promise<PaginationResultType<Entity>> {
  if (paginationOption && paginationOption.page <= 0) {
    throw {
      error: 'Page number must be greater than 0.',
    };
  }
  // take more than required number by 1 record to determine if it has next page or not.
  const amtTake = paginationOption.limit + 1;
  const amtSkip = (paginationOption.page - 1) * paginationOption.limit;
  const manager = repository.manager;
  const a = await manager.transaction(async (manager) => {
    const data = repository.find({
      ...options,
      take: amtTake || 1,
      skip: amtSkip || 0,
    });
    const total = repository.count(options);

    return Promise.all([data, total]);
  });

  const data = a[0];
  const total = a[1];

  const hasNextPage = data.length > paginationOption.limit;
  // time to pop out the last element (because we select more record than required)
  if (hasNextPage) {
    data.pop();
  }
  return {
    data: data,
    currentPage: paginationOption.page,
    hasNextPage,
    totalRecord: total,
  };
}
