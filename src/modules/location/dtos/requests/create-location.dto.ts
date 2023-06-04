import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { LocationStatusEnum } from '../../enums/location-status.enum';

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    status?: LocationStatusEnum;
    familyId?: string;

    @IsNumber()
    @IsNotEmpty()
    long: number;

    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsString()
    @IsOptional()
    description: string;
}
