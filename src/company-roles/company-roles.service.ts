import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';
import { Repository } from 'typeorm';
import { CompanyRoles } from './entities/company-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyRolesService {
  constructor(
    @InjectRepository(CompanyRoles)
    private companyRoleRepository: Repository<CompanyRoles>,
  ) {}

  create(createCompanyRoleDto: CreateCompanyRoleDto, companyId: string, user_role: string): Promise<CompanyRoles> {
    if (user_role !== 'owner' && createCompanyRoleDto.role !== 'employee') {
      return Promise.reject(new UnauthorizedException('You do not have permission to create a company role'));
    }
    return this.companyRoleRepository.save({
      ...createCompanyRoleDto,
      company_id: companyId
    });
  }

  findAllByCompany(companyId: string) {
    return this.companyRoleRepository.find({
      where: {
        company_id: companyId
      },
    });
  }

  findAllByUser(userId: string) {
    return this.companyRoleRepository.find({
      where: {
        user_id: userId
      },
    });
  }

  findOne(id: string) {
    return this.companyRoleRepository.findOne({
      where: {
        id: id
      },
    });
  }

  update(id: string, updateCompanyRoleDto: UpdateCompanyRoleDto) {
    return this.companyRoleRepository.update(id, updateCompanyRoleDto);
  }

  remove(id: string) {
    return this.companyRoleRepository.delete(id);
  }
}
