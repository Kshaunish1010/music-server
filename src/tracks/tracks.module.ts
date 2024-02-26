import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Track } from './entities/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Artist, Album])],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
