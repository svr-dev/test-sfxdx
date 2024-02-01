import { Column, Model, Table, DataType, PrimaryKey } from 'sequelize-typescript';

export interface OrderCreationAttrs {
  orderId: string;
  tokenA: string;
  tokenB: string;
  orderType: 'market' | 'limit';
  userAddress: string;
  amountA: bigint;
  amountB: bigint;
  cancellable?: boolean;
  blockNumber: bigint;
  transactionHash: string;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderCreationAttrs> {
  @PrimaryKey
  @Column({ type: DataType.STRING, allowNull: false })
  orderId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  tokenA: string;

  @Column({ type: DataType.STRING, allowNull: false })
  tokenB: string;

  @Column({ type: DataType.ENUM('market', 'limit'), allowNull: false })
  orderType: 'market' | 'limit';

  @Column({ type: DataType.STRING, allowNull: false })
  userAddress: string;

  @Column({ type: DataType.STRING, allowNull: false })
  amountA: bigint;

  @Column({ type: DataType.STRING, allowNull: false })
  amountB: bigint;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  cancellable: boolean | null;

  @Column({ type: DataType.STRING, allowNull: false })
  blockNumber: bigint;

  @Column({ type: DataType.STRING, allowNull: false })
  transactionHash: string;
}