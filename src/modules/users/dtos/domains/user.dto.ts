import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { FamilyRoleEnum } from '../../../family/enums/family-role.enum';

export class UserDto extends AbstractDto {
    @AutoMap()
    name: string;

    @AutoMap()
    email?: string;

    @AutoMap()
    phoneNumber?: string;

    @AutoMap()
    isActive?: boolean;

    @AutoMap()
    dob?: Date;

    @AutoMap()
    avt?: string;

    familyRole?: FamilyRoleEnum;
    familyId?: string;
}
