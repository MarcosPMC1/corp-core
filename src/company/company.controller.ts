import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';
import { CompanyRoles } from '../enums/roles.decorator';
import { CompanyRole } from '../enums/company-role.enum';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: any) {
    const user = req.user;
    return this.companyService.create(createCompanyDto, user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const user = req.user;
    return this.companyService.findAll(user.sub);
  }

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @CompanyRoles(CompanyRole.Owner)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @CompanyRoles(CompanyRole.Owner)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
