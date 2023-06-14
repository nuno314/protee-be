import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ synchronize: true, name: 'users' })
export class LeaveFamilyUserEntity extends AbstractEntity {
    @Column({ nullable: true })
    @AutoMap()
    name: string;

    @Column({ nullable: true })
    @AutoMap()
    avt: string;

    @Column()
    @AutoMap()
    firebaseId: string;

    @AutoMap()
    @Column({ nullable: true })
    phoneNumber: string;

    @AutoMap()
    @Column({ nullable: true })
    email: string;

    @AutoMap()
    @Column({ default: true })
    isActive: boolean;

    @AutoMap()
    @Column({ nullable: true })
    dob: Date;

    @AutoMap()
    @Column({ nullable: true })
    role: string;
}
