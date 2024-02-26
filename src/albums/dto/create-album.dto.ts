import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;
  @IsString()
  creator: string;
  @IsNumber()
  year: number;
  @IsString()
  company: string;
  @IsOptional()
  @IsNumber()
  number_of_tracks?: number;
  @IsOptional()
  @IsString()
  poster: string;
  @IsOptional()
  @IsArray()
  trackNames: string[];
}
