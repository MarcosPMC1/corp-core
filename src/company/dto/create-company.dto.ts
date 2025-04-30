import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty({
        description: 'Name of the company',
        example: 'Company Name',
        required: true,
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Address of the company',
        example: '123 Main St, City, State, ZIP',
        required: true,
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: 'Phone number of the company',
        example: '+5511999999999',
        required: true,
    })
    @IsPhoneNumber('BR')
    phone: string;

    @ApiProperty({
        description: 'Email of the company',
        example: 'teste@email.com',
        required: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Website of the company',
        example: 'https://www.company.com',
        required: true,
    })
    @IsString()
    website: string;

    @ApiProperty({
        description: 'Logo of the company',
        example: 'https://www.company.com/logo.png',
        required: false,
    })
    @IsString()
    @IsOptional()
    logo: string;

    @ApiProperty({
        description: 'Description of the company',
        example: 'This is a sample company description.',
        required: true,
    })
    @IsString()
    description: string;
}
