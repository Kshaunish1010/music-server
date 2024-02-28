import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './albums/entities/album.entity';
import { Track } from './tracks/entities/track.entity';
import { Artist } from './artists/entities/artist.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Analytics } from './analytics/entities/analytics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AlbumsModule,
    TracksModule,
    ArtistsModule,
    AnalyticsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Album, Track, Artist, Analytics],
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        options: { trustedServerCertificate: true },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
