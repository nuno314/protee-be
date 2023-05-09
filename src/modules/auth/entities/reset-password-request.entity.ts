import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ synchronize: true, name: 'reset_password_request' })
export class ResetPasswordRequestEntity extends AbstractEntity {
    @Column({ unique: true })
    @AutoMap()
    email: string;

    @Column({ unique: true, nullable: true })
    @AutoMap()
    key: string;

    @Column()
    @AutoMap()
    userId: string;
}
