import { ApiProperty } from '@nestjs/swagger';

export class TokenTwoFactorAuthenticationPayload {
    @ApiProperty()
    isTwoFactorAuthentication: boolean;

    @ApiProperty()
    tokenTwoFactorAuthentication?: string;

    @ApiProperty()
    userId?: string;
}
