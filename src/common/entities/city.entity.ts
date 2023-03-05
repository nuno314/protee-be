import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DistrictEntity } from './district.entity';

@Entity({ name: 'cities', synchronize: false })
export class CityEntity {
    @PrimaryColumn({ name: 'id', type: 'varchar', length: 10 })
    @AutoMap()
    id: string;

    @Column({ name: 'code', type: 'varchar', length: 10 })
    @AutoMap()
    code: string;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    @AutoMap()
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    @AutoMap()
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @AutoMap()
    updatedAt: Date;

    @OneToMany(() => DistrictEntity, (district) => district.city)
    districts?: DistrictEntity[];
}
