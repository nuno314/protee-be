import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StatisticUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    quantity: number;

    time: string;
}
