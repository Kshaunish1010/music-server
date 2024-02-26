import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'album_audit'})
export class Analytics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    album_id: number;

    @Column()
    track_id: number;

    @Column()
    user_id: number;

    @Column()
    country: string;

    @Column()
    timestamp:string;
}
