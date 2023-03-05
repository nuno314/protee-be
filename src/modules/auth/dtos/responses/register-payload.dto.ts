import { ApiProperty } from '@nestjs/swagger';

export class RegisterPayloadDto {
    @ApiProperty()
    accessToken: string;
}
