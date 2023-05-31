import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/users.entity';

@Entity({ synchronize: true, name: 'join_family_request' })
export class JoinFamilyRequestEntity extends AbstractEntity {
    @Column({ type: 'uuid' })
    familyId: string;

    @Column({ default: false })
    isApproved: boolean;

    @ManyToOne(() => UserEntity, (u) => u.joinRequests)
    @JoinColumn({ name: 'created_by' })
    user?: UserEntity;
}
