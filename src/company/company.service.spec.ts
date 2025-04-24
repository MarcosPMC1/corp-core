import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyRole } from 'src/enums/company-role.enum';

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
      const createCompanyDto = { name: 'Test Company' };
      const userId = 'user-123';
      const createdCompany = { id: 'company-123', ...createCompanyDto, companyRoles: [{ user_id: userId, role: CompanyRole.Owner }] };

      mockCompanyRepository.create.mockReturnValue(createdCompany);
      mockCompanyRepository.save.mockResolvedValue(createdCompany);

      const result = await service.create(createCompanyDto, userId);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith({
        ...createCompanyDto,
        companyRoles: [{ user_id: userId, role: CompanyRole.Owner }],
      });
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(createdCompany);
      expect(result).toEqual(createdCompany);
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
