import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { FamilyMemberEntity } from '../../family/entities/family-member.entity';

@Entity({ synchronize: true, name: 'users' })
export class UserEntity extends AbstractEntity {
    @Column({ nullable: true })
    @AutoMap()
    name: string;

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
    @OneToMany(() => FamilyMemberEntity, (fm) => fm.user)
    familyMembers?: FamilyMemberEntity[];
}
