import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

@Entity({ synchronize: true, name: 'notifications' })
export class NotificationEntity extends AbstractEntity {
    @Column({ default: null, nullable: true })
    @AutoMap()
    title: string;

    @Column({ default: null, nullable: true })
    @AutoMap()
    content: string;

    @Column({ type: 'uuid' })
    @AutoMap()
    userId: string;

    @Column({ type: 'uuid', nullable: true })
    @AutoMap()
    familyId: string;

    @Column()
    @AutoMap()
    isRead: boolean;

    @Column()
    @AutoMap()
    type: NotificationTypeEnum;

    @AutoMap()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: true,
    })
    data: any;
}
