import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { TrackRepository } from './track.repository';
@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: TrackRepository,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = this.trackRepository.create(createTrackDto);
    const artistNames = createTrackDto.artistsNames;
    const artists = await Promise.all(
      artistNames.map(async (artistName) => {
        let artist = await this.artistRepository.findOne({
          where: { name: artistName },
        });
        if (!artist) {
          artist = this.artistRepository.create({
            name: artistName,
          });
          const newArtist = await this.artistRepository.save(artist);
          return newArtist;
        }
        return artist;
      }),
    );
    track.artists = artists;
    try {
      const savedTrack = await this.trackRepository.save(track);
      return savedTrack;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.trackRepository.find({
      relations: ['albums', 'artists'],
    });
  }

  async findOne(id: number) {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['albums', 'artists'],
    });
    if (!track) return undefined;
    return track;
  }

  async findTrack(name: string) {
    const tracks = await this.trackRepository.find({
      relations: ['albums', 'artists'],
    });
    const lowerCaseName = name.toLowerCase();
    const track = tracks.filter((track) => {
      return track.name.toLowerCase() === lowerCaseName;
    });
    try {
      return track;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const existingTrack = await this.trackRepository.findOne({
      where: { id },
      relations: ['artists'],
    });
    if (!existingTrack) {
      return undefined;
    }
    existingTrack.name = updateTrackDto.name || existingTrack.name;
    existingTrack.len = updateTrackDto.len || existingTrack.len;
    existingTrack.creator = updateTrackDto.creator || existingTrack.creator;
    let artists = [];
    if (updateTrackDto.artistsNames) {
      artists = await Promise.all(
        updateTrackDto.artistsNames.map(async (artistName) => {
          let artist = await this.artistRepository.findOne({
            where: { name: artistName },
          });
          if (!artist) {
            artist = this.artistRepository.create({
              name: artistName,
            });
            const newArtist = await this.artistRepository.save(artist);
            return newArtist;
          }
          return artist;
        }),
      );
    }
    existingTrack.artists.push(...artists);
    try {
      const savedTrack = await this.trackRepository.save(existingTrack);
      return savedTrack;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) return undefined;
    return await this.trackRepository.remove(track);
  }
}
