export interface IBaseEntity {
  _id?: any;
  createdAt?: Date;
}

export abstract class Entity<TData extends Partial<IBaseEntity>> {
  _id?: any;
  createdAt?: Date;

  protected constructor(data: TData) {
    this._id = data._id;
    this.createdAt = data.createdAt ?? new Date();
  }
}
