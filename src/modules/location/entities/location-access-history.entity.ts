import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LocationEntity } from './location.entity';

@Entity({ name: 'location_access_history', synchronize: true })
export class LocationAccessHistoryEntity extends AbstractEntity {
    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    userId: string;

    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @AutoMap()
    @Column()
    distance: number;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLat: number;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLong: number;

    @ManyToOne(() => LocationEntity, (location) => location.accessHistory)
    @JoinColumn({ name: 'location_id' })
    location?: LocationEntity;
}
