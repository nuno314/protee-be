import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/users.entity';
import { FamilyRoleEnum } from '../enums/family-role.enum';
import { FamilyEntity } from './family.entity';

@Entity({ synchronize: true, name: 'family_member' })
export class FamilyMemberEntity extends AbstractEntity {
    @Column()
    @AutoMap()
    familyId: string;

    @Column()
    @AutoMap()
    userId: string;

    @Column()
    @AutoMap()
    role: FamilyRoleEnum;

    @AutoMap()
    @ManyToOne(() => FamilyEntity, (f) => f.familyMembers)
    @JoinColumn({ name: 'family_id' })
    family?: FamilyEntity;

    @AutoMap()
    @ManyToOne(() => UserEntity, (u) => u.familyMembers)
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;
}
