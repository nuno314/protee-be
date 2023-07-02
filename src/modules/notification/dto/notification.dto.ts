import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

export class NotificationDto extends AbstractDto {
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
