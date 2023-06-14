import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { FamilyEntity } from '../../family/entities/family.entity';
import { UserEntity } from '../../users/entities/users.entity';

@Entity({ synchronize: true, name: 'message' })
export class MessageEntity extends AbstractEntity {
    @Column({ type: 'simple-array', nullable: true })
    seenBy: string[];

    @Column()
    content: string;

    @Column({ type: 'uuid' })
    familyId: string;

    @ManyToOne(() => FamilyEntity, (conversation) => conversation.messages)
    @JoinColumn({ name: 'family_id' })
    family?: FamilyEntity;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    @JoinColumn({ name: 'created_by' })
    user?: UserEntity;
}
