import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetNearlyLocationRequest {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    long: number;
}
