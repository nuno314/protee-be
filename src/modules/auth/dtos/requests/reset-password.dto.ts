import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Secret key',
    })
    @IsString()
    @IsNotEmpty()
    secretKey: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
