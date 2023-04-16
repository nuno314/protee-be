/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class SystemUserDto extends AbstractDto {
    @AutoMap()
    email: string;
}
