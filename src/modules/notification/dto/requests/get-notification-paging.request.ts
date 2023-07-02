import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { PaginationRequestDto } from '../../../../common/dto/pagination-request.dto';

export class GetNotificationPagingRequest extends PaginationRequestDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Transform((value) => value === 'true')
    filterUnread?: boolean;
}
