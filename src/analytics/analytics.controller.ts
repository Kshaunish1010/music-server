import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { AnalyticsDataService } from './analytics.data.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService,
    private readonly analyticsDataService: AnalyticsDataService) {}

  @Post()
  create(@Body() createAnalyticsDto: CreateAnalyticsDto) : any {
    return this.analyticsService.create(createAnalyticsDto);
  }

  @Get('/album/:id')
  getAlbumAnalytics(@Param('id') id:string) : any {
    return this.analyticsDataService.getAlbumAnalytics(+id);
    
  }

  @Get('/album/:album_id/track/:track_id')
  getTrackAnalytics(@Param('album_id') albumId:string , @Param('track_id') trackId:string) : any {
    return this.analyticsDataService.getTrackAnalytics(+albumId,+trackId);
  }
}
