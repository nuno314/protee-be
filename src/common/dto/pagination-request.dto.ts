import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationRequestDto {
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    take: number;

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

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
