import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';

describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServiceService;

  const mockServiceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changeActive: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true), // Simula que o guard sempre permite o acesso
  };

  const mockCompanyRolesGuard = {
    canActivate: jest.fn(() => true), // Simula que o guard sempre permite o acesso
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServiceService,
          useValue: mockServiceService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard) // Substitui o AuthGuard pelo mock
    .overrideGuard(CompanyRolesGuard)
    .useValue(mockCompanyRolesGuard) // Substitui o CompanyRolesGuard pelo mock
    .compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServiceService>(ServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createServiceDto: CreateServiceDto = { name: 'Test Service', description: 'Test Description', price: 100 };
      const req = { user: { company: { id: 'company-123' } } };
      const createdService = { id: 'service-123', ...createServiceDto, company_id: 'company-123' };

      mockServiceService.create.mockResolvedValue(createdService);

      const result = await controller.create(createServiceDto, req);

      expect(service.create).toHaveBeenCalledWith(createServiceDto, req.user.company.id);
      expect(result).toEqual(createdService);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const req = { user: { company: { id: 'company-123' } } };
      const services = [
        { id: 'service-1', name: 'Service 1', company_id: 'company-123' },
        { id: 'service-2', name: 'Service 2', company_id: 'company-123' },
      ];

      mockServiceService.findAll.mockResolvedValue(services);

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(req.user.company.id);
      expect(result).toEqual(services);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const serviceId = 'service-123';
      const serviceData = { id: serviceId, name: 'Test Service' };

      mockServiceService.findOne.mockResolvedValue(serviceData);

      const result = await controller.findOne(serviceId);

      expect(service.findOne).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(serviceData);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const serviceId = 'service-123';
      const updateServiceDto: UpdateServiceDto = { name: 'Updated Service' };
      const updatedService = { id: serviceId, ...updateServiceDto };

      mockServiceService.update.mockResolvedValue(updatedService);

      const result = await controller.update(serviceId, updateServiceDto);

      expect(service.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
      expect(result).toEqual(updatedService);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const serviceId = 'service-123';
      const deleteResult = { affected: 1 };

      mockServiceService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(serviceId);

      expect(service.remove).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('activate', () => {
    it('should call service.changeActive with correct parameters', async () => {
      const serviceId = 'service-123';
      const toggleResult = { affected: 1 };

      mockServiceService.changeActive.mockResolvedValue(toggleResult);

      const result = await controller.activate(serviceId);

      expect(service.changeActive).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(toggleResult);
    });
  });
});
