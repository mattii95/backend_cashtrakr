import type { Request, Response } from 'express'
import Budgets from '../models/Budget'
import Expense from '../models/Expense';

export class BudgetController {

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budgets(req.body);
            budget.userId = req.user.id;
            await budget.save()
            res.status(201).json('Budget created successfully')
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budgets.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: { userId: req.user.id }
            });
            res.json(budgets);
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static getById = async (req: Request, res: Response) => {
        try {
            const budget = await Budgets.findByPk(req.budget.id, {
                include: [Expense]
            })
            res.json(budget);
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static updateById = async (req: Request, res: Response) => {
        try {
            await req.budget.update(req.body);
            res.json('Budget updated successfully');
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static deleteById = async (req: Request, res: Response) => {
        try {
            await req.budget.destroy();
            res.json('Budget deleted successfully');
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}