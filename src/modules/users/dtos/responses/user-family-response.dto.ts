import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class FamilyUserDto extends AbstractDto {
    name: string;
    avt: string;
    firebaseId: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    dob: Date;
    familyRole: string;
}
