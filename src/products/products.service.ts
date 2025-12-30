import { Injectable} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductRepository } from './repository/product.repository';
import { Product } from 'src/generated/prisma/client';

@Injectable()
export class ProductsService {
    constructor(private productRepo: ProductRepository){}

    createProduct(data: CreateProductDto): Promise<Product | null>{
        return this.productRepo.createProduct(data);
    }

}
