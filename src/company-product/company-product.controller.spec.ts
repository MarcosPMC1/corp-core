import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProductController } from './company-product.controller';
import { CompanyProductService } from './company-product.service';

describe('CompanyProductController', () => {
  let controller: CompanyProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyProductController],
      providers: [CompanyProductService],
    }).compile();

    controller = module.get<CompanyProductController>(CompanyProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
