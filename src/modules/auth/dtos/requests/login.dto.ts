import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SystemUserLoginDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string;
}

export class LoginByRefreshToken {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
