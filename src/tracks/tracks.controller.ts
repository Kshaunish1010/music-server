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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  async findTracks(
    @Query('name') name?: string,
  ): Promise<Track[] | undefined | Track> {
    if (!name) {
      return await this.tracksService.findAll();
    }
    const track = await this.tracksService.findTrack(name);
    if (track === undefined) throw new NotFoundException('Track not found');
    return track;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Track | undefined> {
    const track = await this.tracksService.findOne(id);
    if (track === undefined) throw new NotFoundException('Track not found');
    return track;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTrackDto: UpdateTrackDto,
  ): Promise<Track | undefined> {
    const track = await this.tracksService.update(id, updateTrackDto);
    if (track === undefined) throw new NotFoundException('Track not found');
    return track;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const track = await this.tracksService.remove(id);
    if (track === undefined) throw new NotFoundException('Track not found');
    return track;
  }
}
