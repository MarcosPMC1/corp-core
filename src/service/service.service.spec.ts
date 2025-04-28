import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { NotFoundException } from '@nestjs/common';

describe('ServiceService', () => {
  let service: ServiceService;
  let repository: Repository<Service>;

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
        ServiceService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    repository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const createServiceDto = { name: 'Test Service', description: 'Test Description', price: 100 };
      const companyId = 'company-123';
      const savedService = { id: 'service-123', ...createServiceDto, company_id: companyId };

      mockRepository.save.mockResolvedValue(savedService);

      const result = await service.create(createServiceDto, companyId);

      expect(repository.save).toHaveBeenCalledWith({
        ...createServiceDto,
        company_id: companyId,
      });
      expect(result).toEqual(savedService);
    });
  });

  describe('findAll', () => {
    it('should return all active services for a company', async () => {
      const companyId = 'company-123';
      const services = [
        { id: 'service-1', name: 'Service 1', isActive: true, company_id: companyId },
        { id: 'service-2', name: 'Service 2', isActive: true, company_id: companyId },
      ];

      mockRepository.find.mockResolvedValue(services);

      const result = await service.findAll(companyId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true, company_id: companyId },
      });
      expect(result).toEqual(services);
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const serviceId = 'service-123';
      const serviceData = { id: serviceId, name: 'Test Service', isActive: true };

      mockRepository.findOne.mockResolvedValue(serviceData);

      const result = await service.findOne(serviceId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: serviceId, isActive: true },
      });
      expect(result).toEqual(serviceData);
    });

    it('should return null if service is not found', async () => {
      const serviceId = 'service-123';

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(serviceId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: serviceId, isActive: true },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a service by id', async () => {
      const serviceId = 'service-123';
      const updateServiceDto = { name: 'Updated Service' };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(serviceId, updateServiceDto);

      expect(repository.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('changeActive', () => {
    it('should toggle the isActive status of a service', async () => {
      const serviceId = 'service-123';
      const serviceData = { id: serviceId, isActive: true };

      mockRepository.findOne.mockResolvedValue(serviceData);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeActive(serviceId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: serviceId },
      });
      expect(repository.update).toHaveBeenCalledWith(serviceId, { isActive: false });
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if service is not found', async () => {
      const serviceId = 'service-123';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.changeActive(serviceId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: serviceId },
      });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a service by id', async () => {
      const serviceId = 'service-123';

      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(serviceId);

      expect(repository.delete).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
