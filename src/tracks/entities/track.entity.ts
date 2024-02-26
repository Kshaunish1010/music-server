import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  len: number;

  @Column()
  creator: string;

  @ManyToMany(() => Album, (album) => album.tracks)
  albums: Album[];

  @JoinTable()
  @ManyToMany(() => Artist, (artist) => artist.tracks)
  artists: Artist[];
}
