import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DistrictEntity } from './district.entity';

@Entity({ name: 'wards', synchronize: false })
export class WardEntity {
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

    @Column({ name: 'district_id' })
    @AutoMap()
    districtId: string;

    @ManyToOne(() => DistrictEntity, (district) => district.wards)
    @JoinColumn({ name: 'district_id' })
    district?: DistrictEntity;
}
