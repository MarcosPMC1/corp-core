import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsPhoneNumber('BR')
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    website: string;

    @IsString()
    @IsOptional()
    logo: string;

    @IsString()
    description: string;
}
