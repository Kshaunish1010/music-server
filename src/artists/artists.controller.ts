import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body(ValidationPipe) createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  async findArtist(
    @Query('name') name?: string,
  ): Promise<Artist[] | undefined | Artist> {
    if (!name) return this.artistsService.findAll();
    const artist = await this.artistsService.findArtist(name);
    if (artist === undefined) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Artist | undefined> {
    const artist = this.artistsService.findOne(id);
    if (artist === undefined) throw new NotFoundException('Artist not found');
    return artist;
  }
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Artist | undefined> {
    const artist = await this.artistsService.remove(id);
    if (artist === undefined) throw new NotFoundException('Artist not found');
    return artist;
  }
}
