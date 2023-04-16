import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SocialRegisterDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @MaxLength(100)
    name: string;
}
