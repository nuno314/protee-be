import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

import { PaginationRequestDto } from '../../../../common/dto/pagination-request.dto';

export class GetUserAccessLocationHistoryRequest extends PaginationRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    fromDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    toDate: string;
}
