import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import Budgets from './Budget';

@Table({
  tableName: 'expenses'
})
class Expense extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100)
  })
  declare name: string

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL
  })
  declare amount: number

  @ForeignKey(() => Budgets)
  declare budgetId: number

  @BelongsTo(() => Budgets)
  declare budget: Budgets
}

export default Expense;