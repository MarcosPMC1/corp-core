import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRolesService } from './company-roles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyRoles } from './entities/company-role.entity';
import { UnauthorizedException } from '@nestjs/common';
import { CompanyRole } from '../enums/company-role.enum';

describe('CompanyRolesService', () => {
  let service: CompanyRolesService;
  let repository: Repository<CompanyRoles>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRolesService,
        {
          provide: getRepositoryToken(CompanyRoles),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyRolesService>(CompanyRolesService);
    repository = module.get<Repository<CompanyRoles>>(getRepositoryToken(CompanyRoles));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company role if user is owner', async () => {
      const createCompanyRoleDto = { user_id: 'user-123', role: CompanyRole.Employee };
      const companyId = 'company-123';
      const userRole = 'owner';

      mockRepository.save.mockResolvedValue({
        id: 'role-123',
        ...createCompanyRoleDto,
        company_id: companyId,
      });

      const result = await service.create(createCompanyRoleDto, companyId, userRole);

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...createCompanyRoleDto,
        company_id: companyId,
      });
      expect(result).toEqual({
        id: 'role-123',
        ...createCompanyRoleDto,
        company_id: companyId,
      });
    });

    it('should throw UnauthorizedException if user is not owner', async () => {
      const createCompanyRoleDto = { user_id: 'user-123', role: CompanyRole.Manager };
      const companyId = 'company-123';
      const userRole = CompanyRole.Employee;

      await expect(service.create(createCompanyRoleDto, companyId, userRole)).rejects.toThrow(UnauthorizedException);

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllByCompany', () => {
    it('should return all roles for a company', async () => {
      const companyId = 'company-123';
      const roles = [
        { id: 'role-1', user_id: 'user-1', company_id: companyId, role: 'employee' },
        { id: 'role-2', user_id: 'user-2', company_id: companyId, role: 'manager' },
      ];

      mockRepository.find.mockResolvedValue(roles);

      const result = await service.findAllByCompany(companyId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { company_id: companyId },
      });
      expect(result).toEqual(roles);
    });
  });

  describe('findAllByUser', () => {
    it('should return all roles for a user', async () => {
      const userId = 'user-123';
      const roles = [
        { id: 'role-1', user_id: userId, company_id: 'company-1', role: 'employee' },
        { id: 'role-2', user_id: userId, company_id: 'company-2', role: 'manager' },
      ];

      mockRepository.find.mockResolvedValue(roles);

      const result = await service.findAllByUser(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const roleId = 'role-123';
      const role = { id: roleId, user_id: 'user-123', company_id: 'company-123', role: 'employee' };

      mockRepository.findOne.mockResolvedValue(role);

      const result = await service.findOne(roleId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should update a role by id', async () => {
      const roleId = 'role-123';
      const updateCompanyRoleDto = { role: CompanyRole.Manager };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(roleId, updateCompanyRoleDto);

      expect(mockRepository.update).toHaveBeenCalledWith(roleId, updateCompanyRoleDto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a role by id', async () => {
      const roleId = 'role-123';

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(roleId);

      expect(mockRepository.delete).toHaveBeenCalledWith(roleId);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
