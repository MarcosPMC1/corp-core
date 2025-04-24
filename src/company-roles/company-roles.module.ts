import { Module } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CompanyRolesController } from './company-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRoles } from './entities/company-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRoles])],
  controllers: [CompanyRolesController],
  providers: [CompanyRolesService],
})
export class CompanyRolesModule {}
