import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserDto } from '../../users/dtos/domains/user.dto';
import { LocationEntity } from './location.entity';
import { UserLocationHistoryEntity } from './user-location-history.entity';

@Entity({ name: 'location_access_history', synchronize: true })
export class LocationAccessHistoryEntity extends AbstractEntity {
    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    userLocationHistoryId: string;

    @AutoMap()
    @Column()
    distance: number;

    @ManyToOne(() => LocationEntity, (location) => location.accessHistory)
    @JoinColumn({ name: 'location_id' })
    location?: LocationEntity;

    @ManyToOne(() => UserLocationHistoryEntity, (location) => location.accessHistory)
    @JoinColumn({ name: 'user_location_history_id' })
    userLocationHistory?: UserLocationHistoryEntity;

    user?: UserDto;
}
