import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantImageController } from './product-variant-image.controller';

describe('ProductVariantImageController', () => {
  let controller: ProductVariantImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantImageController],
    }).compile();

    controller = module.get<ProductVariantImageController>(ProductVariantImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
