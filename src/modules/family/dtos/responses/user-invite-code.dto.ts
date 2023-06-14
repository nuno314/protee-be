import { FamilyUserEntity } from '../../../users/entities/user-family-response.entity';

export class UserInviteCodeDto {
    user: FamilyUserEntity;
    code: string;
}
