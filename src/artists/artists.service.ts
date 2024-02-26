import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(artist);
  }

  async findAll() {
    return await this.artistRepository.find({
      relations: ['tracks'],
    });
  }

  async findOne(id: number) {
    return await this.artistRepository.findOne({ where: { id } });
  }

  async findArtist(name: string) {
    const artists = await this.artistRepository.find({
      relations: ['tracks'],
    });
    const x = String(name);
    const lowerCaseName = x.toLowerCase();
    const artist = artists.filter((artist) => {
      return artist.name.toLowerCase() === lowerCaseName;
    });
    try {
      return artist;
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    const artist = await this.artistRepository.findOne({
      where: { id },
    });
    if (!artist) return undefined;
    return await this.artistRepository.remove(artist);
  }
}
