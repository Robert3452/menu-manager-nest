import { Repository, SelectQueryBuilder } from 'typeorm';
import { IBaseRepository } from './IBaseRepository';
import boom from '@hapi/boom';
import { IQuery } from './dto/Query';
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
    const found = await this.getOneById(id);
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
      const found = await this.getOneById(id);
      this.baseRepository.merge(found, body);
      const saved = await this.baseRepository.save(found);
      return saved;
    } catch (error) {
      console.log(error);
    }
  }
  async list(query: IQuery): Promise<T[]> {
    const { pageNumber, pageSize } = query;

    const result = this.getQueryBuilder('base')
      .skip((pageNumber - 1) * pageSize) // Calcula el índice de inicio basado en el número de página y el tamaño de la página
      .take(pageSize) // Limita el número de resultados a la página actual
      .getMany();
    return result;
  }
  async getOneById(id: any): Promise<T> {
    const found = await this.baseRepository.findOneBy({ id });
    if (!found) throw boom.notFound('Item not found with id: ' + id);
    return found;
  }
  getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.baseRepository.createQueryBuilder(alias);
  }
}
