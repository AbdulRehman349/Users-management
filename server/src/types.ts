import { FilterQuery, QueryOptions } from 'mongoose';

export type JwtPayload = {
  iat: number;
  exp: number;
  _id: string;
};

export type DisableType = { disabled: boolean };

export type DeletedType = { deleted: boolean };

export type FindPayloadType<Model> = {
  filter?: FilterQuery<Model>;
  options?: QueryOptions;
  ref?: any;
  where?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
};

export interface UpdatePayloadType<Model, Dto> {
  filter: FilterQuery<Model>;
  body?: Dto | { $set: Dto } | { $push: Record<string, any> };
  options?: QueryOptions;
  ref?: any;
}

export interface DeletePayloadType<Model> {
  filter: FilterQuery<Model>;
  body?: { $set: DeletedType };
  options?: QueryOptions;
}

export interface DisablePayloadType<Model> {
  filter: FilterQuery<Model>;
  body?: { $set: DisableType };
  options?: QueryOptions;
}