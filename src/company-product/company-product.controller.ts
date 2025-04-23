import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyProductService } from './company-product.service';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';

@Controller('company-product')
export class CompanyProductController {
  constructor(private readonly companyProductService: CompanyProductService) {}

  @Post()
  create(@Body() createCompanyProductDto: CreateCompanyProductDto) {
    return this.companyProductService.create(createCompanyProductDto);
  }

  @Get()
  findAll() {
    return this.companyProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyProductDto: UpdateCompanyProductDto) {
    return this.companyProductService.update(+id, updateCompanyProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyProductService.remove(+id);
  }
}
