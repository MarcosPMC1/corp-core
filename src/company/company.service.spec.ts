import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyRole } from '../enums/company-role.enum';

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: Repository<Company>;

  const mockCompanyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company with the owner role', async () => {
      const createCompanyDto = {
        name: 'Test Company',
        address: '123 Test St',
        phone: '+5511999999999',
        email: 'test@company.com',
        website: 'https://testcompany.com',
        logo: 'logo.png',
        description: 'A test company',
      }; // DTO completo
      const userId = 'user-123';
      const createdCompany = {
        ...createCompanyDto,
        companyRoles: [{ user_id: userId, role: CompanyRole.Owner }],
      } as Company;

      // Espiona os métodos do repositório
      const createSpy = jest.spyOn(repository, 'create').mockReturnValue(createdCompany as any);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({...createdCompany, id: 'company-123'});

      // Chama o método do serviço
      const result = await service.create(createCompanyDto, userId);

      // Verifica se os métodos do repositório foram chamados corretamente
      expect(createSpy).toHaveBeenCalledWith({
        ...createCompanyDto,
        companyRoles: [{ user_id: userId, role: CompanyRole.Owner }],
      });
      expect(saveSpy).toHaveBeenCalledWith({
        ...createCompanyDto,
        companyRoles: [{ user_id: userId, role: CompanyRole.Owner }],
      });

      // Verifica se o resultado é o esperado
      expect(result).toEqual({...createdCompany, id: 'company-123'});

      // Restaura os métodos espiados
      createSpy.mockRestore();
      saveSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all companies for a user', async () => {
      const userId = 'user-123';
      const companies = [
        { id: 'company-1', name: 'Company 1', companyRoles: [{ user_id: userId, role: CompanyRole.Employee }] },
        { id: 'company-2', name: 'Company 2', companyRoles: [{ user_id: userId, role: CompanyRole.Owner }] },
      ];

      mockCompanyRepository.find.mockResolvedValue(companies);

      const result = await service.findAll(userId);

      expect(mockCompanyRepository.find).toHaveBeenCalledWith({
        where: { companyRoles: { user_id: userId } },
        relations: ['companyRoles'],
      });
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      const companyId = 'company-123';
      const company = { id: companyId, name: 'Test Company', companyRoles: [] };

      mockCompanyRepository.findOne.mockResolvedValue(company);

      const result = await service.findOne(companyId);

      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { id: companyId },
        relations: ['companyRoles'],
      });
      expect(result).toEqual(company);
    });
  });
});
