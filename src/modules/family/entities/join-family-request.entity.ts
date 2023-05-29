import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ synchronize: true, name: 'join_family_request' })
export class JoinFamilyRequestEntity extends AbstractEntity {
    @Column({ type: 'uuid' })
    familyId: string;

    @Column({ default: false })
    isApproved: boolean;
}
