import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class ProfileDto extends AbstractDto {
    @AutoMap()
    email: string;
}
