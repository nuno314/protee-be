import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';

@Entity({ name: 'location', synchronize: true })
export class Location extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    status?: LocationStatusEnum;

    @Column('decimal', { precision: 10, scale: 6 })
    lat: number;

    @Column('decimal', { precision: 10, scale: 6 })
    long: number;

    @Column({ nullable: true })
    description: string;
}
