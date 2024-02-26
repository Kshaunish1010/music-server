import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createAlbumDto: CreateAlbumDto,
  ): Promise<Album | undefined> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAlbum(
    @Query('title') title?: string,
  ): Promise<Album[] | undefined> {
    if (title === undefined) return await this.albumsService.findAll();
    const album = await this.albumsService.findAlbum(title);
    if (album === undefined) throw new NotFoundException('Album not found');
    return album;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Album | undefined> {
    const album = await this.albumsService.findOne(id);
    if (album === undefined) throw new NotFoundException('Album not found');
    return album;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    const album = await this.albumsService.update(id, updateAlbumDto);
    if (album === undefined) throw new NotFoundException('Album not found');
    return album;
  }

  @Post(':id')
  async removeTrack(
    @Param('id', ParseIntPipe) id: number,
    @Body() trackIdObject: { track_id: number },
  ) {
    const track_id = Number(trackIdObject.track_id);
    return await this.albumsService.trackRemove(id, track_id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumsService.remove(id);
    if (album === undefined) throw new NotFoundException('Album not found');
    return album;
  }
}
