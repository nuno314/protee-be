import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { SettingsCodeEnum } from '../../enums/settings-type.enum';

export class UpdateSettingDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    data: number;

    // @ApiProperty()
    // @IsOptional()
    // @IsString()
    // code: SettingsCodeEnum;
}
