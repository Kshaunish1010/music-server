import { IsUUID , IsString, IsNumber } from "class-validator";

export class CreateAnalyticsDto {

    @IsNumber()
    album_id : number

    @IsNumber()
    track_id : number

    @IsNumber()
    user_id : number

    @IsString()
    country : string

    @IsString()
    timestamp : string
}
