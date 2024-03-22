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
  id: string;

  @Column({ type: 'varchar', length: 50 })
  originalName: string;

  @Column({ type: 'varchar', length: 50 })
  localizedName: string;

  @Column({ type: 'int2' })
  releaseYear: number;

  @Column({ type: 'float4', nullable: true })
  rating?: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];
}
