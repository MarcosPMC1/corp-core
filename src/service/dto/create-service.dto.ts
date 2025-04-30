import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateServiceDto {
    @ApiProperty({
        description: 'Name of the service',
        example: 'Service Name',
        required: true,
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description of the service',
        example: 'Service Description',
        required: true,
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Price of the service',
        example: 100,
        required: true,
    })
    @IsNumber()
    price: number;
}
