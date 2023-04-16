import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class UpdateAccountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    dob: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @IsPhoneNumber("VI")
    phoneNumber: string;
}