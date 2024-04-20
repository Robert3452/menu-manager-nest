import { IQuery } from './dto/Query';

export interface IBaseRepository<T> {
  create(body: T): Promise<T>;
  update(id: any, body: T): Promise<T>;
  list(query: IQuery): Promise<T[]>;
  findOneById(id: any): Promise<T>;
  delete(id: any): Promise<T>;
}
