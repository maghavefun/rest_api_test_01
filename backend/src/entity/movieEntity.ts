import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genreEntity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  movieId: string;

  @Column({ type: 'varchar', length: 50 })
  original_name: string;

  @Column({ type: 'varchar', length: 50 })
  localized_name: string;

  @Column({ type: 'int2' })
  release_year: number;

  @Column({ type: 'float4', nullable: true })
  rating?: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];
}
