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

  async create(movieDTO: Partial<Omit<Movie, 'movieId'>>) {
    try {
      const genres = await this.databaseSource
        .createQueryBuilder(Genre, 'genre')
        .where('genre.genreId IN (:...genres)', { genres: movieDTO.genres })
        .getMany();

      const movie = await this.databaseSource
        .getRepository(Movie)
        .create(movieDTO);
      movie.genres = genres;
      await this.databaseSource.getRepository(Movie).save(movie);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateById(id: string, updateDTO: Partial<Omit<Movie, 'movieId'>>) {
    try {
      let movie: Movie;
      await this.databaseSource
        .getRepository(Movie)
        .update({ movieId: id }, updateDTO);
      movie = await this.databaseSource
        .getRepository(Movie)
        .findOneBy({ movieId: id });

      return movie;
    } catch (err) {
      throw err;
    }
  }

  async deleteById(id: string) {
    try {
      await this.databaseSource.getRepository(Movie).delete({ movieId: id });
    } catch (err) {
      throw err;
    }
  }

  async getDetailsById(id: string): Promise<Movie> {
    try {
      return await this.databaseSource
        .getRepository(Movie)
        .findOneBy({ movieId: id });
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

      if (filterOptions.original_name) {
        moviesQuery.andWhere('LOWER(movie.original_name) like LOWER(:o_name)', {
          o_name: `%${filterOptions.original_name}%`,
        });
      }

      if (filterOptions.localized_name) {
        moviesQuery.andWhere(
          'LOWER(movie.localized_name) like LOWER(:l_name)',
          {
            l_name: `%${filterOptions.localized_name}%`,
          },
        );
      }

      if (filterOptions.rating) {
        moviesQuery.andWhere('movie.rating = :rating', {
          rating: filterOptions.rating,
        });
      }

      if (filterOptions.release_year) {
        moviesQuery.andWhere('movie.release_year = :release_year', {
          release_year: filterOptions.release_year,
        });
      }

      if (sortOptions.rating_sort) {
        moviesQuery.addOrderBy('movie.rating', sortOptions.rating_sort);
      }

      if (sortOptions.release_year_sort) {
        moviesQuery.addOrderBy(
          'movie.release_year',
          sortOptions.release_year_sort,
        );
      }

      if (filterOptions.take) {
        moviesQuery.take(Number(filterOptions.take));
      }

      if (filterOptions.skip) {
        moviesQuery.skip(Number(filterOptions.skip));
      }

      return moviesQuery.getMany();
    } catch (err) {
      throw err;
    }
  }
}
