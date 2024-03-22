import { DataSource } from 'typeorm';
import { databaseSource } from './../dbSource';
import { Movie } from '../entity/movieEntity';
import { IMovieService } from '../interfaces/services/IMovieService';
import {
  MovieFilterOptions,
  MovieSortOptions,
} from '../validators/movieValidator';
import { Genre } from '../entity/genreEntity';

export class MovieService implements IMovieService {
  databaseSource: DataSource;

  constructor() {
    this.databaseSource = databaseSource;
  }

  async create(movieDTO: Partial<Omit<Movie, 'id'>>) {
    try {
      const genres = await this.databaseSource
        .createQueryBuilder(Genre, 'genre')
        .where('genre.id IN (:...genres)', { genres: movieDTO.genres })
        .getMany();

      const movie = await this.databaseSource
        .getRepository(Movie)
        .create(movieDTO);
      movie.genres = genres;
      await this.databaseSource.getRepository(Movie).save(movie);
    } catch (err) {
      throw err;
    }
  }

  async updateById(id: string, updateDTO: Partial<Omit<Movie, 'id'>>) {
    try {
      let movie: Movie;
      await this.databaseSource.getRepository(Movie).update({ id }, updateDTO);
      movie = await this.databaseSource.getRepository(Movie).findOneBy({ id });

      return movie;
    } catch (err) {
      throw err;
    }
  }

  async deleteById(id: string) {
    try {
      await this.databaseSource.getRepository(Movie).delete({ id });
    } catch (err) {
      throw err;
    }
  }

  async getDetailsById(id: string): Promise<Movie> {
    try {
      return await this.databaseSource.getRepository(Movie).findOneBy({ id });
    } catch (err) {
      throw err;
    }
  }

  async getListBy(
    filterOptions: MovieFilterOptions,
    sortOptions: MovieSortOptions,
  ): Promise<Movie[]> {
    try {
      const moviesQuery = await this.databaseSource.createQueryBuilder(
        Movie,
        'movie',
      );

      if (filterOptions.genres) {
        moviesQuery.leftJoinAndSelect(
          'movie.genres',
          'genre',
          'genre.genreId IN(:...genres)',
          {
            genres: filterOptions.genres.split(','),
          },
        );
      } else {
        moviesQuery.leftJoinAndSelect('movie.genres', 'genre');
      }

      if (filterOptions.originalName) {
        moviesQuery.andWhere(
          'LOWER(movie.original_name) like LOWER(:originalName)',
          {
            originalName: `%${filterOptions.originalName}%`,
          },
        );
      }

      if (filterOptions.localizedName) {
        moviesQuery.andWhere(
          'LOWER(movie.localized_name) like LOWER(:localizedName)',
          {
            localizedName: `%${filterOptions.localizedName}%`,
          },
        );
      }

      if (filterOptions.rating) {
        moviesQuery.andWhere('movie.rating = :rating', {
          rating: filterOptions.rating,
        });
      }

      if (filterOptions.releaseYear) {
        moviesQuery.andWhere('movie.release_year = :releaseYear', {
          releaseYear: filterOptions.releaseYear,
        });
      }

      if (sortOptions.ratingSort) {
        moviesQuery.addOrderBy('movie.rating', sortOptions.ratingSort);
      }

      if (sortOptions.releaseYearSort) {
        moviesQuery.addOrderBy(
          'movie.releaseYear',
          sortOptions.releaseYearSort,
        );
      }

      if (filterOptions.take) {
        moviesQuery.take(Number(filterOptions.take));
      }

      if (filterOptions.skip) {
        moviesQuery.skip(Number(filterOptions.skip));
      }

      return await moviesQuery.getMany();
    } catch (err) {
      throw err;
    }
  }
}
