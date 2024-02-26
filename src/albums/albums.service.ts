import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { In, Repository } from 'typeorm';
import { Track } from 'src/tracks/entities/track.entity';
import { TrackRepository } from 'src/tracks/track.repository';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: TrackRepository,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = this.albumRepository.create(createAlbumDto);
    album.number_of_tracks = 0;
    if (album.tracks) {
      const tracks = await this.trackRepository.find({
        relations: ['artists'],
      });
      album.tracks = tracks.filter((track) =>
        createAlbumDto.trackNames.includes(track.name),
      );
      album.number_of_tracks = album.tracks.length;
    }
    if (!album.poster) {
      album.poster =
        'https://img.freepik.com/free-vector/electro-music-album_53876-67221.jpg';
    }
    try {
      const savedAlbum = await this.albumRepository.save(album);
      return savedAlbum;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.albumRepository.find({
      relations: ['tracks', 'tracks.artists'],
    });
  }

  async findOne(id: number) {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'tracks.artists'],
    });
    if (!album) {
      return undefined;
    }
    return album;
  }

  async findAlbum(title: string) {
    const albums = await this.albumRepository.find({
      relations: ['tracks', 'tracks.artists'],
    });
    const lowerCaseTitle = title.toLowerCase();
    const album = albums.filter((album) => {
      return album.title.toLowerCase() === lowerCaseTitle;
    });
    try {
      return album;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    const existingAlbum = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });
    if (!existingAlbum) {
      return undefined;
    }

    existingAlbum.title = updateAlbumDto.title || existingAlbum.title;
    existingAlbum.creator = updateAlbumDto.creator || existingAlbum.creator;
    existingAlbum.year = updateAlbumDto.year || existingAlbum.year;
    existingAlbum.company = updateAlbumDto.company || existingAlbum.company;
    existingAlbum.poster = updateAlbumDto.poster || existingAlbum.poster;
    if (updateAlbumDto.trackNames) {
      const existingTrackNames = new Set(
        existingAlbum.tracks.map((track) => track.name),
      );
      const trackIdsToAdd = updateAlbumDto.trackNames.filter(
        (name) => !existingTrackNames.has(name),
      );
      const tracksToAdd = await this.trackRepository.find({
        where: { name: In(trackIdsToAdd) },
        relations: ['artists'],
      });
      existingAlbum.tracks.push(...tracksToAdd);
      existingAlbum.number_of_tracks = existingAlbum.tracks.length;
    }
    try {
      const savedAlbum = await this.albumRepository.save(existingAlbum);
      return savedAlbum;
    } catch (error) {
      throw error;
    }
  }

  async trackRemove(id: number, track_id: number) {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'tracks.artists'],
    });

    if (!album) {
      return undefined;
    }
    album.tracks = album.tracks.filter((track) => track.id !== track_id);
    await this.albumRepository.save(album);
    return album;
  }

  async remove(id: number) {
    const album = await this.albumRepository.findOne({
      where: { id },
    });
    return await this.albumRepository.remove(album);
  }
}
