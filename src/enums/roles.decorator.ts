
import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';
import { CompanyRole } from './company-role.enum';

export const ROLES_KEY = 'role';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const COMPANY_ROLES_KEY = 'companyRole';
export const CompanyRoles = (...CompanyRole: CompanyRole[]) => SetMetadata(COMPANY_ROLES_KEY, CompanyRole);
