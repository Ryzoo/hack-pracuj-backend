import { ObjectId } from '@fastify/mongodb';

import { PaginationQueryStringSchemaType } from '../schema/pagination-schema';
import { MatchMode } from '../types/match-mode';

const mapFilterQueryToMongoFilters = (filters: PaginationQueryStringSchemaType['filters']): any => {
  if (!filters) return {};

  const newFilters: any = {};
  const keys = Object.keys(filters);

  for (const key of keys) {
    const filter = filters[key];
    const preparedTranslationKey = filter.locale ? `${key}.${filter.locale}` : key;
    let newValue: any = filter.value;

    switch (filter.matchMode) {
      case MatchMode.DateGte:
        newValue = { $gte: new Date(newValue) };
        break;
      case MatchMode.DateLte:
        newValue = { $lte: new Date(newValue) };
        break;
      case MatchMode.DateGt:
        newValue = { $gt: new Date(newValue) };
        break;
      case MatchMode.DateLt:
        newValue = { $lt: new Date(newValue) };
        break;
      case MatchMode.DateEqual:
        newValue = { $eq: new Date(newValue) };
        break;
      case MatchMode.DateNotEqual:
        newValue = { $ne: new Date(newValue) };
        break;
      case MatchMode.TextStarts:
        newValue = { $regex: `^${newValue}.*`, $options: 'i' };
        break;
      case MatchMode.TextEnds:
        newValue = { $regex: `.*${newValue}$`, $options: 'i' };
        break;
      case MatchMode.TextContains:
        newValue = { $regex: `.*${newValue}.*`, $options: 'i' };
        break;
      case MatchMode.TextNotContains:
        newValue = { $not: { $regex: `.*${newValue}.*`, $options: 'i' } };
        break;
      case MatchMode.TextEqual:
        if (key === '_id') newValue = new ObjectId(newValue);
        newValue = { $eq: newValue };
        break;
      case MatchMode.TextNotEqual:
        if (key === '_id') newValue = new ObjectId(newValue);
        newValue = { $ne: newValue };
        break;
      case MatchMode.BoolTrue:
        newValue = { $eq: true };
        break;
      case MatchMode.BoolFalse:
        newValue = { $ne: true };
        break;
      case MatchMode.NumberGte:
        newValue = { $gte: Number(newValue) };
        break;
      case MatchMode.NumberLte:
        newValue = { $lte: Number(newValue) };
        break;
      case MatchMode.NumberGt:
        newValue = { $gt: Number(newValue) };
        break;
      case MatchMode.NumberLt:
        newValue = { $lt: Number(newValue) };
        break;
      case MatchMode.In:
        if (key === '_id')
          newValue = { $in: newValue.split(',').map((id: string) => new ObjectId(id)) };
        else newValue = { $in: newValue.split(',') };
        break;
      case MatchMode.NotIn:
        if (key === '_id')
          newValue = { $nin: newValue.split(',').map((id: string) => new ObjectId(id)) };
        else newValue = { $nin: newValue.split(',') };
        break;
      case MatchMode.Between:
        newValue = { $gte: newValue.split(',')[0], $lte: newValue.split(',')[1] };
        break;
      case MatchMode.Exists:
        newValue = { $exists: newValue === 'true' };
        break;
    }

    if (newFilters[preparedTranslationKey] !== undefined) {
      newFilters[preparedTranslationKey] = {
        ...(typeof newFilters[preparedTranslationKey] === 'string'
          ? { $eq: newFilters[preparedTranslationKey] }
          : newFilters[preparedTranslationKey]),
        ...(typeof newValue === 'string' ? { $eq: newValue } : newValue),
      };
    } else {
      newFilters[preparedTranslationKey] = newValue;
    }
  }

  return newFilters;
};

export default mapFilterQueryToMongoFilters;
