import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ name: 'location', synchronize: true })
export class Location extends AbstractEntity {
    @Column('decimal', { precision: 10, scale: 6 })
    lat: number;

    @Column('decimal', { precision: 10, scale: 6 })
    long: number;

    @Column({ nullable: true })
    description: string;
}
