import { AutoMap } from '@automapper/classes';

import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class FamilyDto extends AbstractDto {
    @AutoMap()
    name: string;
}
