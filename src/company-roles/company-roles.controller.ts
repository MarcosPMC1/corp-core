import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';
import { CompanyRoles } from '../enums/roles.decorator';
import { CompanyRole } from '../enums/company-role.enum';

@Controller('company-roles')
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) {}

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @CompanyRoles(CompanyRole.Owner, CompanyRole.Manager)
  @Post()
  create(@Body() createCompanyRoleDto: CreateCompanyRoleDto, @Request() req: any) {
    return this.companyRolesService.create(createCompanyRoleDto, req.user.company.id, req.user.company.role);
  }

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @Get('/company/:id')
  findAllByCompany(@Param('id') id: string) {
    return this.companyRolesService.findAllByCompany(id);
  }

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @Get('/user/:id')
  findAllByUser(@Param('id') id: string) {
    return this.companyRolesService.findAllByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyRolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyRoleDto: UpdateCompanyRoleDto) {
    return this.companyRolesService.update(id, updateCompanyRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyRolesService.remove(id);
  }
}
