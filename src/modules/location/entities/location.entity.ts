import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LocationStatusEnum } from '../enums/location-status.enum';
import { LocationAccessHistoryEntity } from './location-access-history.entity';

@Entity({ name: 'location', synchronize: true })
export class LocationEntity extends AbstractEntity {
    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column()
    status: LocationStatusEnum;

    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    familyId: string;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    lat: number;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    long: number;

    @AutoMap()
    @Column({ nullable: true })
    description: string;

    @AutoMap()
    distance?: number;

    @AutoMap()
    @Column({ default: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png' })
    icon: string;

    @OneToMany(() => LocationAccessHistoryEntity, (history) => history.location)
    accessHistory: LocationAccessHistoryEntity;
}
