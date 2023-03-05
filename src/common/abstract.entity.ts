'use strict';
import { AutoMap } from '@automapper/classes';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @AutoMap()
    id?: string;

    @Column({ type: 'uuid', default: null, nullable: true })
    @AutoMap()
    createdBy?: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    @AutoMap()
    createdAt?: Date;

    @AutoMap()
    @Column({ type: 'uuid', default: null, nullable: true })
    updatedBy?: string | null;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    @AutoMap()
    updatedAt?: Date;

    @AutoMap()
    @Column({ type: 'uuid', default: null, nullable: true })
    deletedBy?: string | null;

    @DeleteDateColumn({ nullable: true, name: 'deleted_at', type: 'timestamp with time zone' })
    @AutoMap()
    deletedAt?: Date | null;
}
