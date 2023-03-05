import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { CityEntity } from './city.entity';
import { WardEntity } from './ward.entity';

@Entity({ name: 'districts', synchronize: false })
export class DistrictEntity {
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

    @Column({ name: 'city_id' })
    @AutoMap()
    cityId: string;

    @ManyToOne(() => CityEntity, (city) => city.districts)
    @JoinColumn({ name: 'city_id' })
    city?: CityEntity;

    @OneToMany(() => WardEntity, (ward) => ward.district)
    wards?: WardEntity[];
}
