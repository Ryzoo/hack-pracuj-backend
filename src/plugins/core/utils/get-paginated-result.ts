import { FastifyRequest } from 'fastify';

import { PaginationQueryStringSchemaType, PaginationSchemaType } from '../schema/pagination-schema';
import mapFilterQueryToMongoFilters from './map-filter-query-to-mongo-filters';

type GetPaginatedResultProperties<T> = {
  request: FastifyRequest<{
    Body: PaginationQueryStringSchemaType;
    Querystring: any;
    Params: any;
  }>;
  findQuery: any;
  sortQuery?: any;
  projectionQuery: { [key in keyof T]: number };
  entityName: string;
};

const getPaginatedResult = async <T>({
  request,
  entityName,
  sortQuery,
  findQuery,
  projectionQuery,
}: GetPaginatedResultProperties<T>): Promise<PaginationSchemaType<T>> => {
  const requestPage = request.body.page || 0;
  const requestLimit = request.body.limit || 10;
  const collection = request.server.mongo.db!.collection(entityName);
  const sorts = request.body.sortField
    ? {
        [request.body.sortField]: request.body.sortOrder || 1,
      }
    : {};
  const filters = mapFilterQueryToMongoFilters(request.body.filters);

  const finalFindQuery = {
    ...findQuery,
    ...filters,
  };

  const finalSortQuery = {
    ...(sortQuery ?? {}),
    ...sorts,
  };

  const items = await collection
    .find(finalFindQuery)
    .sort(finalSortQuery)
    .skip(requestPage * requestLimit)
    .limit(requestLimit)
    .project(projectionQuery as never)
    .toArray();

  const totalCount = await collection.countDocuments(finalFindQuery);

  return {
    items: items as T[],
    page: requestPage,
    limit: requestLimit,
    count: items.length,
    totalCount,
    totalPages: Math.ceil(totalCount / requestLimit),
  } as PaginationSchemaType<T>;
};

export default getPaginatedResult;
