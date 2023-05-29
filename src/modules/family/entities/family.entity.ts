import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { MessageEntity } from '../../message/entities/message.entity';
import { FamilyInviteCodeEntity } from './family-invite-code.entity';
import { FamilyMemberEntity } from './family-member.entity';

@Entity({ synchronize: true, name: 'family' })
export class FamilyEntity extends AbstractEntity {
    @Column()
    @AutoMap()
    name: string;

    @AutoMap()
    @OneToMany(() => FamilyMemberEntity, (fm) => fm.family)
    familyMembers?: FamilyMemberEntity[];

    @AutoMap()
    @OneToOne(() => FamilyInviteCodeEntity, (fc) => fc.family)
    inviteCode?: FamilyInviteCodeEntity;

    @AutoMap()
    @OneToMany(() => MessageEntity, (m) => m.family)
    messages?: MessageEntity[];
}
