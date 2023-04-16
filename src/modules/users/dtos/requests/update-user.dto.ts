import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    dob: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}