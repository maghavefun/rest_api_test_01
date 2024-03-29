import { databaseSource } from '../dbSource';
import { Genre } from '../entity/genreEntity';
import { IGenreService } from '../interfaces/services/IGenreService';
import { DataSource } from 'typeorm';

export class GenreService implements IGenreService {
  databaseSource: DataSource;

  constructor() {
    this.databaseSource = databaseSource;
  }

  async create(genreDTO: Partial<Omit<Genre, 'id' | 'movies'>>) {
    try {
      let genre = await this.databaseSource
        .getRepository(Genre)
        .create(genreDTO);
      await this.databaseSource.getRepository(Genre).save(genre);
    } catch (err) {
      throw err;
    }
  }

  async updateById(
    id: string,
    updateDTO: Partial<Omit<Genre, 'id' | 'movies'>>,
  ) {
    try {
      let genre: Genre;
      await this.databaseSource
        .getRepository(Genre)
        .update({ id }, { ...updateDTO });
      genre = await this.databaseSource.getRepository(Genre).findOneBy({ id });

      return genre;
    } catch (err) {
      throw err;
    }
  }

  async deleteById(id: string) {
    try {
      await this.databaseSource.getRepository(Genre).delete({ id });
    } catch (err) {
      throw err;
    }
  }

  async getDetailsById(id: string) {
    try {
      return await this.databaseSource.getRepository(Genre).findOneBy({ id });
    } catch (err) {
      throw err;
    }
  }

  async getList() {
    try {
      return await this.databaseSource.getRepository(Genre).find();
    } catch (err) {
      throw err;
    }
  }
}
