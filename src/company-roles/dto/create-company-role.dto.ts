import { IsEnum, IsUUID } from "class-validator";
import { CompanyRole } from "../../enums/company-role.enum";

export class CreateCompanyRoleDto {
    @IsUUID()
    user_id: string;

    @IsEnum(CompanyRole)
    role: CompanyRole
}
