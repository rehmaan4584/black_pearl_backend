import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartRepository } from './repository/cart.repository';

type CartWithItems = NonNullable<
  Awaited<ReturnType<CartRepository['findByUserId']>>
>;

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  private toCartResponse(cart: CartWithItems) {
    const items = cart.items.map((item) => {
      const variant = item.productVariant;
      const primaryImage =
        variant.images.find((image) => image.isPrimary) ?? variant.images[0];
      const lineTotal = item.quantity * variant.price;

      return {
        id: item.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice: variant.price,
        lineTotal,
        product: {
          id: variant.product.id,
          title: variant.product.title,
          brand: variant.product.brand,
        },
        variant: {
          id: variant.id,
          sku: variant.sku,
          size: variant.size.name,
          color: variant.color.name,
          colorHex: variant.color.hexCode,
          availableQuantity: variant.inventory?.quantity ?? 0,
          imageUrl: primaryImage?.url ?? null,
        },
      };
    });

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: items.reduce((total, item) => total + item.lineTotal, 0),
    };
  }

  private async getOrCreateCart(userId: number, tx: Prisma.TransactionClient) {
    const existingCart = await this.cartRepository.findByUserId(userId, tx);
    if (existingCart) return existingCart;

    await this.cartRepository.createForUser(userId, tx);
    const cart = await this.cartRepository.findByUserId(userId, tx);
    if (!cart) {
      throw new BadRequestException('Could not create cart');
    }
    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.cartRepository.runTransaction((tx) =>
      this.getOrCreateCart(userId, tx),
    );
    return this.toCartResponse(cart);
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    const cart = await this.cartRepository.runTransaction(async (tx) => {
      const variant = await this.cartRepository.findProductVariant(
        dto.productVariantId,
        tx,
      );
      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      const availableQuantity = variant.inventory?.quantity ?? 0;
      if (availableQuantity < dto.quantity) {
        throw new BadRequestException('Requested quantity is not available');
      }

      const userCart = await this.getOrCreateCart(userId, tx);
      const existingItem = await this.cartRepository.findItem(
        userCart.id,
        dto.productVariantId,
        tx,
      );

      if (existingItem) {
        const nextQuantity = existingItem.quantity + dto.quantity;
        if (nextQuantity > availableQuantity) {
          throw new BadRequestException('Requested quantity exceeds stock');
        }
        await this.cartRepository.updateItemQuantity(
          existingItem.id,
          nextQuantity,
          tx,
        );
      } else {
        await this.cartRepository.addItem(
          userCart.id,
          dto.productVariantId,
          dto.quantity,
          tx,
        );
      }

      const updatedCart = await this.cartRepository.findByUserId(userId, tx);
      if (!updatedCart) {
        throw new BadRequestException('Could not load cart');
      }
      return updatedCart;
    });

    return this.toCartResponse(cart);
  }

  async updateItem(userId: number, cartItemId: number, dto: UpdateCartItemDto) {
    const item = await this.cartRepository.findItemForUser(cartItemId, userId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const availableQuantity = item.productVariant.inventory?.quantity ?? 0;
    if (dto.quantity > availableQuantity) {
      throw new BadRequestException('Requested quantity exceeds stock');
    }

    await this.cartRepository.updateItemQuantity(cartItemId, dto.quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: number, cartItemId: number) {
    const result = await this.cartRepository.deleteItem(cartItemId, userId);
    if (result.count === 0) {
      throw new ForbiddenException('Cart item does not belong to this user');
    }
    return this.getCart(userId);
  }
}
