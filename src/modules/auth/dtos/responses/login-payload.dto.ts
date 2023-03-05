import { ApiProperty } from '@nestjs/swagger';

export class LoginPayloadDto {
    @ApiProperty()
    expiresIn?: number;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    requireRegister?: boolean;
}
