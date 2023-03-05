import { AutoMap } from '@automapper/classes';

export class LocationDto {
    @AutoMap()
    id: string;
    @AutoMap()
    code: string;
    @AutoMap()
    name: string;
    @AutoMap()
    createdAt: Date;
    @AutoMap()
    updatedAt: Date;
}
