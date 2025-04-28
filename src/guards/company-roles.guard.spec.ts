import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource, Repository, In } from 'typeorm';
import { CompanyRolesGuard } from './company-roles.guard';
import { CompanyRoles } from '../company-roles/entities/company-role.entity';
import { CompanyRole } from '../enums/company-role.enum';
import { COMPANY_ROLES_KEY } from '../enums/roles.decorator';

describe('CompanyRolesGuard', () => {
  let guard: CompanyRolesGuard;
  let reflector: Reflector;
  let dataSource: DataSource;
  let companyRolesRepository: Repository<CompanyRoles>;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockDataSource = {
    getRepository: jest.fn(),
  };

  const mockCompanyRolesRepository = {
    findOne: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn(), // Mock do switchToHttp
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  beforeEach(() => {
    reflector = mockReflector as unknown as Reflector;
    dataSource = mockDataSource as unknown as DataSource;
    companyRolesRepository = mockCompanyRolesRepository as unknown as Repository<CompanyRoles>;

    mockDataSource.getRepository.mockReturnValue(companyRolesRepository);

    guard = new CompanyRolesGuard(reflector, dataSource);

    // Configura o switchToHttp para retornar um objeto com getRequest
    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn(),
    });
  });

  it('should throw ForbiddenException if user is not authenticated', async () => {
    // Configura o Reflector para retornar os papéis necessários
    mockReflector.getAllAndOverride.mockReturnValue([CompanyRole.Owner]);

    // Configura o request simulado
    const request = { user: null, url: '/company/123' };
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue(request);

    // Cria o contexto de execução simulado
    const context = mockExecutionContext as unknown as ExecutionContext;

    // Chama o método canActivate e verifica se lança ForbiddenException
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});