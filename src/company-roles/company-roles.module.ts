import { Module } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CompanyRolesController } from './company-roles.controller';

@Module({
  controllers: [CompanyRolesController],
  providers: [CompanyRolesService],
})
export class CompanyRolesModule {}
