import { IsEnum, IsUUID } from "class-validator";
import { CompanyRole } from "../../enums/company-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyRoleDto {
    @ApiProperty({
        description: 'ID of the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: 'role for the company',
        example: 'admin',
        enum: CompanyRole,
        required: true,
    })
    @IsEnum(CompanyRole)
    role: CompanyRole
}
