import { Table, Column, DataType, HasMany, BelongsTo, ForeignKey, Model } from 'sequelize-typescript'

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
}

export default Budgets;