import { FamilyUserDto } from '../../../users/dtos/responses/user-family-response.dto';

export class UserInviteCodeDto {
    user: FamilyUserDto;
    code: string;
}
