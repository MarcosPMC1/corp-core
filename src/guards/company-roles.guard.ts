import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMPANY_ROLES_KEY } from '../enums/roles.decorator';
import { Role } from '../enums/role.enum';
import { DataSource, In } from 'typeorm';
import { CompanyRoles } from '../company-roles/entities/company-role.entity';

@Injectable()
export class CompanyRolesGuard implements CanActivate {
  private companyRolesRepository;

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource, // Injeta o DataSource
  ) {
    this.companyRolesRepository = this.dataSource.getRepository(CompanyRoles); // Obtém o repositório manualmente
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(COMPANY_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { user, headers } = request;

    if (!user || !user.sub) {
      throw new ForbiddenException('Access denied: User not authenticated.');
    }

    const company_id = headers['company-id']

    if (!company_id) {
      throw new ForbiddenException('Access denied: Company ID not provided.');
    }

    // Verifica se o usuário tem o papel necessário na empresa especificada
    const hasRoles = await this.companyRolesRepository.findOne({
      where: {
        user_id: user.sub,
        company_id: company_id,
        role: In(requiredRoles),
      },
    });

    if (!hasRoles) {
      throw new ForbiddenException('Access denied: Insufficient permissions.');
    }

    request['user'] = {
      ...user,
      company: {
        id: company_id,
        role: hasRoles.role,
      }
    };

    return true;
  }
}