import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class UserDto extends AbstractDto {
    @AutoMap()
    name: string;

    @AutoMap()
    email: string;

    @AutoMap()
    phoneNumber: string;

    @AutoMap()
    isActive: boolean;

    @AutoMap()
    dob: Date;

    @AutoMap()
    avt: string;
}
