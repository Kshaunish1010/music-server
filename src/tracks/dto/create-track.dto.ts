import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;
  @IsNumber()
  len: number;
  @IsString()
  creator: string;
  @IsArray()
  artistsNames: string[];
}
