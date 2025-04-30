import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(createServiceDto: CreateServiceDto, companyId: string) {
    return this.serviceRepository.save({
      ...createServiceDto,
      company_id: companyId,
    });
  }

  findAll(companyId: string) {
    return this.serviceRepository.find({
      where: { isActive: true, company_id: companyId },
    });
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({
      where: { id, isActive: true },
    });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.serviceRepository.update(id, updateServiceDto);
  }

  async changeActive(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.serviceRepository.update(id, { isActive: !service.isActive });
  }


  remove(id: string) {
    return this.serviceRepository.softDelete(id);
  }
}
