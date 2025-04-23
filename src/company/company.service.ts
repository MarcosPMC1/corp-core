import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRole } from 'src/enums/company-role.enum';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}


  create(createCompanyDto: CreateCompanyDto, userId: string) {
    return this.companyRepository.save(
      this.companyRepository.create({
        ...createCompanyDto,
        companyRoles: [{
          user_id: userId,
          role: CompanyRole.Owner,
        }],
      })
    );  
  }

  findAll(userId: string) {
    return this.companyRepository.find({
      where: { 
        companyRoles: {
          user_id: userId,
        },
       },
      relations: ['companyRoles'],
    });
  }

  findOne(id: string) {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['companyRoles'],
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
