import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserDto } from '../../users/dtos/domains/user.dto';
import { LocationAccessHistoryEntity } from './location-access-history.entity';

@Entity({ name: 'user_location_history', synchronize: true })
export class UserLocationHistoryEntity extends AbstractEntity {
    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLat: number;

    @AutoMap()
    @Column('decimal', { precision: 10, scale: 6 })
    currentLong: number;

    @AutoMap()
    @Column({ type: 'uuid', nullable: true })
    familyId: string;

    @OneToMany(() => LocationAccessHistoryEntity, (history) => history.location)
    accessHistory?: LocationAccessHistoryEntity[];

    user?: UserDto;
}
