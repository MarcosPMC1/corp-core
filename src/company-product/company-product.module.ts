import { Module } from '@nestjs/common';
import { CompanyProductService } from './company-product.service';
import { CompanyProductController } from './company-product.controller';

@Module({
  controllers: [CompanyProductController],
  providers: [CompanyProductService],
})
export class CompanyProductModule {}
