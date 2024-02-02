import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Order, OrderCreationAttrs } from "../../orders/orders.model";

@Injectable()
export class OrderDAO {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {}

  async createOrUpdateOrder(orderData: Partial<OrderCreationAttrs>, transaction?: Transaction): Promise<Order> {
    const { orderId } = orderData;
    let order = await this.orderModel.findOne({ where: { orderId }, transaction });

    if (order) {
      return order.update(orderData, { transaction });
    } else {
      return this.orderModel.create(orderData as OrderCreationAttrs, { transaction });
    }
  }
}
