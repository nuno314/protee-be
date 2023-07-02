import { AutoMap } from '@automapper/classes';

import { NotificationTypeEnum } from '../../enums/notification-type.enum';

export class CreateNotificationDto {
    @AutoMap()
    title: string;

    @AutoMap()
    content: string;

    @AutoMap()
    userId: string;

    @AutoMap()
    familyId: string;

    @AutoMap()
    isRead: boolean;

    @AutoMap()
    type: NotificationTypeEnum;

    @AutoMap()
    data: any;
}
