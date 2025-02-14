import { Table, Column, DataType, HasMany, Model } from 'sequelize-typescript'
import Expense from './Expense';

@Table({
    tableName: 'budgets'
})
class Budgets extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[]
}

export default Budgets;