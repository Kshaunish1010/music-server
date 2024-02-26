import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Album } from "src/albums/entities/album.entity";
import { Track } from "src/tracks/entities/track.entity";
import { TrackRepository } from "src/tracks/track.repository";
import { Repository } from "typeorm";
import { Analytics } from "./entities/analytics.entity";

@Injectable()
export class AnalyticsDataService {
    constructor(
        @InjectRepository(Album)
        private readonly albumRepository: Repository<Album>,
        @InjectRepository(Track)
        private readonly trackRepository: TrackRepository,
        @InjectRepository(Analytics)
        private readonly analyticsRepository: Repository<Analytics>
    ) { }

    async getAlbumAnalytics(id: number): Promise<any> {
        try {
            const album = await this.albumRepository.findOne({
                where: { id }
            })

            if (album === null) {
                throw new NotFoundException("Album does not exist");
            }

            const playTimes = await this.analyticsRepository.count({
                where: { album_id: id }
            })

            const countries = await this.analyticsRepository.query(
                'select distinct country from album_audit',
            );

            const users = await this.analyticsRepository.query(
                `select distinct user_id from album_audit where album_id=${id}`
            );


            return {
                ...album,
                play_times: playTimes,
                countries: countries.map((item: any) => item.country),
                users: users.length
            }
        }
        catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
        }
    }

    async getTrackAnalytics(albumId: number, trackId: number): Promise<any> {
        try {
            const track = await this.trackRepository.findOne({
                where: { id: trackId }
            })

            if (track === null) {
                throw new NotFoundException("Track does not exist");
            }

            const playTimes = await this.analyticsRepository.count({
                where: {
                    album_id: albumId,
                    track_id: trackId
                }
            })

            const users = await this.analyticsRepository.query(
                `select distinct user_id from album_audit where album_id=${albumId} and track_id=${trackId}`
            );

            return {
                ...track,
                play_times: playTimes,
                users: users.length
            }
        }
        catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
        }
    }
}