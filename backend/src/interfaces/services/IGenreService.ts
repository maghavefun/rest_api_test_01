import { Genre } from 'src/entity/genreEntity';
import { DataSource } from 'typeorm';

export interface IGenreService {
  databaseSource: DataSource;
  create(createDTO: Partial<Omit<Genre, 'genreId'>>): Promise<void>;
  updateById(
    id: string,
    updateDTO: Partial<Omit<Genre, 'genreId'>>,
  ): Promise<Genre>;
  deleteById(id: string): Promise<void>;
  getDetailsById(id: string): Promise<Genre>;
  getList(): Promise<Genre[]>;
}
