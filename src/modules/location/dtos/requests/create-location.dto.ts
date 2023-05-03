import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
    @IsNumber()
    @IsNotEmpty()
    long: number;

    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsString()
    @IsOptional()
    description: string;
}
