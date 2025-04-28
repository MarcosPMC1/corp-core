import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
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
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard) // Substitui o AuthGuard pelo mock
      .overrideGuard(CompanyRolesGuard)
      .useValue(mockCompanyRolesGuard) // Substitui o CompanyRolesGuard pelo mock
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        address: '123 Test St',
        phone: '+5511999999999',
        email: 'test@company.com',
        website: 'https://testcompany.com',
        logo: 'logo.png',
        description: 'A test company',
      };
      const req = { user: { sub: 'user-123' } };

      mockCompanyService.create.mockResolvedValue('new-company');

      const result = await controller.create(createCompanyDto, req);

      expect(service.create).toHaveBeenCalledWith(createCompanyDto, req.user.sub);
      expect(result).toBe('new-company');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const req = { user: { sub: 'user-123' } };
      const companies = [{ id: 'company-1', name: 'Company 1' }];

      mockCompanyService.findAll.mockResolvedValue(companies);

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(req.user.sub);
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const companyId = 'company-123';
      const company = { id: companyId, name: 'Test Company' };

      mockCompanyService.findOne.mockResolvedValue(company);

      const result = await controller.findOne(companyId);

      expect(service.findOne).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(company);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const companyId = 'company-123';
      const updateCompanyDto: UpdateCompanyDto = { name: 'Updated Company' };

      mockCompanyService.update.mockResolvedValue('updated-company');

      const result = await controller.update(companyId, updateCompanyDto);

      expect(service.update).toHaveBeenCalledWith(companyId, updateCompanyDto);
      expect(result).toBe('updated-company');
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const companyId = 'company-123';

      mockCompanyService.remove.mockResolvedValue('deleted-company');

      const result = await controller.remove(companyId);

      expect(service.remove).toHaveBeenCalledWith(companyId);
      expect(result).toBe('deleted-company');
    });
  });
});
