import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';

@Controller('company-roles')
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) {}

  @Post()
  create(@Body() createCompanyRoleDto: CreateCompanyRoleDto) {
    return this.companyRolesService.create(createCompanyRoleDto);
  }

  @Get()
  findAll() {
    return this.companyRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyRoleDto: UpdateCompanyRoleDto) {
    return this.companyRolesService.update(+id, updateCompanyRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyRolesService.remove(+id);
  }
}
