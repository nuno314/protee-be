export class OtpDto {
    entityId: string;
    email?: string;
    phoneNumber?: string;
    otp?: string;
    secret?: string;
    createdAt?: Date;
    latestGenerated?: string;
    verifySuccessAt?: Date;
    verifySuccessSecretKey?: string;
}
