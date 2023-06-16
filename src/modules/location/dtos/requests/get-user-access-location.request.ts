import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { PaginationRequestDto } from '../../../../common/dto/pagination-request.dto';

export class GetUserAccessLocationHistoryRequest extends PaginationRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    fromDate: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    toDate: string;
}
