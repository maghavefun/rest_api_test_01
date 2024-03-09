import { Movie } from 'src/entity/movieEntity';
import { DataSource } from 'typeorm';

export interface IMovieService {
  databaseSource: DataSource;
  create(createDTO: Partial<Omit<Movie, 'movieId'>>): Promise<void>;
  updateById(
    id: string,
    updateDTO: Partial<Omit<Movie, 'movieId'>>,
  ): Promise<Movie>;
  deleteById(id: string): Promise<void>;
  getDetailsById(id: string): Promise<Movie>;
  getListBy(findOptions: any, sortOptions: any): Promise<Movie[]>;
}
