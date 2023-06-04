import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';

@Entity({ name: 'location', synchronize: true })
export class Location extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    status: LocationStatusEnum;

    @Column({ type: 'uuid', nullable: true })
    familyId: string;

    @Column('decimal', { precision: 10, scale: 6 })
    lat: number;

    @Column('decimal', { precision: 10, scale: 6 })
    long: number;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png' })
    icon: string;
}
