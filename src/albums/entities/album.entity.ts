import { Track } from 'src/tracks/entities/track.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column()
  year: number;

  @Column()
  company: string;

  @Column()
  number_of_tracks: number;

  @Column()
  poster: string;

  @JoinTable()
  @ManyToMany(() => Track, (track) => track.albums)
  tracks: Track[];
}
