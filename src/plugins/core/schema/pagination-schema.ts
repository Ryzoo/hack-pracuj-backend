import { Static, type TSchema, Type } from '@sinclair/typebox';

import { MatchMode } from '../types/match-mode';

export const PaginationSchema = <T extends TSchema>(T: T) =>
  Type.Object({
    page: Type.Number(),
    totalPages: Type.Number(),
    count: Type.Number(),
    totalCount: Type.Number(),
    items: Type.Array(T),
  });

export const PaginationQueryStringSchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 0 })),
  limit: Type.Optional(Type.Number({ maximum: 100, minimum: 1 })),
  sortField: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Number()),
  filters: Type.Optional(
    Type.Record(
      Type.String(),
      Type.Object({
        value: Type.Any(),
        matchMode: Type.Enum(MatchMode),
        locale: Type.Optional(Type.String()),
      }),
    ),
  ),
});

export type PaginationQueryStringSchemaType = Static<typeof PaginationQueryStringSchema>;
export type PaginationSchemaType<T> = {
  page: number;
  totalPages: number;
  count: number;
  totalCount: number;
  items: T[];
};
