import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRolesController } from './company-roles.controller';
import { CompanyRolesService } from './company-roles.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';
import { CompanyRole } from '../enums/company-role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';

describe('CompanyRolesController', () => {
  let controller: CompanyRolesController;
  let service: CompanyRolesService;

  const mockCompanyRolesService = {
    create: jest.fn(),
    findAllByCompany: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true), // Simula que o guard sempre permite o acesso
  };

  const mockCompanyRolesGuard = {
    canActivate: jest.fn(() => true), // Simula que o guard sempre permite o acesso
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyRolesController],
      providers: [
        {
          provide: CompanyRolesService,
          useValue: mockCompanyRolesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard) // Substitui o AuthGuard pelo mock
      .overrideGuard(CompanyRolesGuard)
      .useValue(mockCompanyRolesGuard) // Substitui o CompanyRolesGuard pelo mock
      .compile();

    controller = module.get<CompanyRolesController>(CompanyRolesController);
    service = module.get<CompanyRolesService>(CompanyRolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createCompanyRoleDto: CreateCompanyRoleDto = { user_id: 'user-123', role: CompanyRole.Employee };
      const companyId = 'company-123';
      const req = { user: { company: { id: companyId, role: CompanyRole.Owner } } }; // Simula o objeto de requisição
      mockCompanyRolesService.create.mockResolvedValue('new-role');

      const result = await controller.create(createCompanyRoleDto, req);

      expect(service.create).toHaveBeenCalledWith(createCompanyRoleDto, req.user.company.id, req.user.company.role);
      expect(result).toBe('new-role');
    });
  });

  describe('findAllByCompany', () => {
    it('should call service.findAllByCompany with correct parameters', async () => {
      const companyId = 'company-123';
      const roles = [{ id: 'role-1', user_id: 'user-1', role: 'employee' }];

      mockCompanyRolesService.findAllByCompany.mockResolvedValue(roles);

      const result = await controller.findAllByCompany(companyId);

      expect(service.findAllByCompany).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(roles);
    });
  });

  describe('findAllByUser', () => {
    it('should call service.findAllByUser with correct parameters', async () => {
      const userId = 'user-123';
      const roles = [{ id: 'role-1', company_id: 'company-1', role: 'manager' }];

      mockCompanyRolesService.findAllByUser.mockResolvedValue(roles);

      const result = await controller.findAllByUser(userId);

      expect(service.findAllByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const roleId = 'role-123';
      const role = { id: roleId, user_id: 'user-123', role: 'employee' };

      mockCompanyRolesService.findOne.mockResolvedValue(role);

      const result = await controller.findOne(roleId);

      expect(service.findOne).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const roleId = 'role-123';
      const updateCompanyRoleDto: UpdateCompanyRoleDto = { role: CompanyRole.Manager };

      mockCompanyRolesService.update.mockResolvedValue('updated-role');

      const result = await controller.update(roleId, updateCompanyRoleDto);

      expect(service.update).toHaveBeenCalledWith(roleId, updateCompanyRoleDto);
      expect(result).toBe('updated-role');
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const roleId = 'role-123';

      mockCompanyRolesService.remove.mockResolvedValue('deleted-role');

      const result = await controller.remove(roleId);

      expect(service.remove).toHaveBeenCalledWith(roleId);
      expect(result).toBe('deleted-role');
    });
  });
});
