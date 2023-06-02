import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class UpdateAccountDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    dob: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsPhoneNumber('VI')
    phoneNumber: string;
}
