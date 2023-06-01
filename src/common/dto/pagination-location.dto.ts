import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationLocationDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    filter?: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    sortField?: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    order = 'ASC' || 'DESC';
    @ApiProperty()
    @IsString()
    @IsOptional()
    status?: string;
}
