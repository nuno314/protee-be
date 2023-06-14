import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LocationAccessHistoryEntity } from './location-access-history.entity';

@Entity({ name: 'user_location_history', synchronize: true })
export class UserLocationHistoryEntity extends AbstractEntity {
    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLat: number;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLong: number;

    @OneToMany(() => LocationAccessHistoryEntity, (history) => history.location)
    accessHistory?: LocationAccessHistoryEntity[];
}
