import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { ConfigService } from '@nestjs/config';
import { AnalyticsDataService } from './analytics.data.service';
import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics,Album,Track])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService,AnalyticsDataService,AppService],
})
export class AnalyticsModule {

  constructor(private readonly analyticsService:AnalyticsService,
    private readonly configService:ConfigService) {
    
    this.analyticsService.init();
    
  }
}
