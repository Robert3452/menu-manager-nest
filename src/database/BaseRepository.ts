import boom from '@hapi/boom';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IQuery } from './dto/Query';
import { IBaseRepository } from './IBaseRepository';
export interface PublicEntity {
  id: number;
}
export class BaseRepository<T extends PublicEntity>
  implements IBaseRepository<T>
{
  baseRepository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.baseRepository = repository;
  }
  async delete(id: any): Promise<T> {
    const found = await this.findOneById(id);
    await this.baseRepository.delete(id);
    return found;
  }

  async create(body: T): Promise<T> {
    const created = this.baseRepository.create(body);
    const saved = await this.baseRepository.save(created);
    return saved;
  }
  async update(id: any, body: T): Promise<T> {
    try {
      const found = await this.findOneById(id);
      this.baseRepository.merge(found, body);
      const saved = await this.baseRepository.save(found);
      return saved;
    } catch (error) {
      console.log(error);
    }
  }
  async list(query: IQuery): Promise<T[]> {
    const { pageNumber, pageSize } = query;

    const result = this.createQueryBuilder('base')
      .skip((pageNumber - 1) * pageSize) // Calcula el índice de inicio basado en el número de página y el tamaño de la página
      .take(pageSize) // Limita el número de resultados a la página actual
      .getMany();
    return result;
  }
  async findOneById(id: any): Promise<T> {
    const found = await this.baseRepository.findOneBy({ id });
    if (!found) throw boom.notFound('Item not found with id: ' + id);
    return found;
  }
  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.baseRepository.createQueryBuilder(alias);
  }
}
