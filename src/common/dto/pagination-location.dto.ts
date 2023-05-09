import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationLocationDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    filter?: string;
}
