import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { RolesEnum } from '../../../common/enums/roles.enum';

@Entity({ synchronize: false, name: 'system_users' })
export class SystemUserEntity extends AbstractEntity {
    @Column({ unique: true })
    @AutoMap()
    email: string;

    @Column()
    @AutoMap()
    password: string;

    @Column()
    @AutoMap()
    role: RolesEnum;
}
