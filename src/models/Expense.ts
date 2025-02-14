import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Budgets from './Budget';

@Table({
    tableName: 'expenses'
})
class Expense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

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