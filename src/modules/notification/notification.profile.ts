import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { NotificationDto } from './dto/notification.dto';
import { CreateNotificationDto } from './dto/requests/create-notification-request.dto';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        return (mapper: any) => {
            createMap(
                mapper,
                CreateNotificationDto,
                NotificationEntity,
                forMember(
                    (d) => d.data,
                    mapFrom((s) => s.data)
                )
            );
            createMap(
                mapper,
                NotificationEntity,
                NotificationDto,
                forMember(
                    (d) => d.data,
                    mapFrom((s) => s.data)
                )
            );
        };
    }
}
