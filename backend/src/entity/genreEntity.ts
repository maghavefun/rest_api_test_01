import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movieEntity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  genreId: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}
