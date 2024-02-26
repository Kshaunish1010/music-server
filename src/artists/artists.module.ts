import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
