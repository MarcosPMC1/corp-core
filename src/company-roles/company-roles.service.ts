import { Injectable } from '@nestjs/common';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';

@Injectable()
export class CompanyRolesService {
  create(createCompanyRoleDto: CreateCompanyRoleDto) {
    return 'This action adds a new companyRole';
  }

  findAll() {
    return `This action returns all companyRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyRole`;
  }

  update(id: number, updateCompanyRoleDto: UpdateCompanyRoleDto) {
    return `This action updates a #${id} companyRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyRole`;
  }
}
