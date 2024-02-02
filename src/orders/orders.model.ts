import { Column, Model, Table, DataType, PrimaryKey } from 'sequelize-typescript';

export interface OrderCreationAttrs {
  orderId: string;
  tokenA: string;
  tokenB: string;
  amountA: bigint;
  amountB: bigint;
  status: 'active' | 'partially_filled' | 'filled' | 'cancelled' | null
  isMarket: boolean;
  amountReceived: bigint;
  amountPaid: bigint;
  amountLeftToFill: string;
  userAddress: string;
  fee: string;
  feeRate: string;
  cancellable: boolean;
  blockNumber: bigint;
  transactionHash: string;
  matchedId: string;
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

  @Column({ type: DataType.STRING, allowNull: false })
  amountA: bigint;

  @Column({ type: DataType.STRING, allowNull: false })
  amountB: bigint;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isMarket: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  amountReceived: bigint

  @Column({ type: DataType.STRING, allowNull: true })
  amountPaid: bigint
  
  @Column({ type: DataType.STRING, allowNull: true })
  amountLeftToFill: string
  
  @Column({ type: DataType.ENUM('active', 'partially_filled', 'filled', 'cancelled'), allowNull: true })
  status: 'active' | 'partially_filled' | 'filled' | 'cancelled' | null

  @Column({ type: DataType.STRING, allowNull: false })
  userAddress: string;

  @Column({ type: DataType.STRING, allowNull: true })
  fee: string;
  
  @Column({ type: DataType.STRING, allowNull: true })
  feeRate: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  cancellable: boolean | null;

  @Column({ type: DataType.STRING, allowNull: false })
  blockNumber: bigint;

  @Column({ type: DataType.STRING, allowNull: false })
  transactionHash: string;

  @Column({ type: DataType.STRING, allowNull: true })
  matchedId: string;
}