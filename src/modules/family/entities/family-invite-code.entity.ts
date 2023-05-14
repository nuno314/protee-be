import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { FamilyEntity } from './family.entity';

@Entity({ synchronize: true, name: 'family_invite_code' })
export class FamilyInviteCodeEntity extends AbstractEntity {
    @Column({ unique: true })
    @AutoMap()
    code: string;

    @Column({ unique: true })
    @AutoMap()
    familyId: string;

    @AutoMap()
    @OneToOne(() => FamilyEntity, (fm) => fm.inviteCode)
    family?: FamilyEntity;
}
