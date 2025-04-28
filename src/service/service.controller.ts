import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CompanyRolesGuard } from '../guards/company-roles.guard';
import { CompanyRoles } from '../enums/roles.decorator';
import { CompanyRole } from '../enums/company-role.enum';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(AuthGuard, CompanyRolesGuard)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @Request() req: any) {
    return this.serviceService.create(createServiceDto, req.user.company.id);
  }

  @Get()
  findAll(@Request() req: any) {

    return this.serviceService.findAll(req.user.company.id);
  } 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.serviceService.changeActive(id);
  }
}
