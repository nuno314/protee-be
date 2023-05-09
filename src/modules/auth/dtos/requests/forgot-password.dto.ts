import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(10)
    email: string;
}
