import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { FamilyMemberEntity } from './family-member.entity';

@Entity({ synchronize: true, name: 'family' })
export class FamilyEntity extends AbstractEntity {
    @Column()
    @AutoMap()
    name: string;

    @AutoMap()
    @OneToMany(() => FamilyMemberEntity, (fm) => fm.family)
    familyMembers?: FamilyMemberEntity[];
}
