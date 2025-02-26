import type { Request, Response } from 'express'
import Expense from '../models/Expense'
import { body } from 'express-validator';

export class ExpenseController {

  static create = async (req: Request, res: Response) => {
    try {
      const expense = new Expense(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json('Expense created successfully');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }

  static getById = async (req: Request, res: Response) => {
    try {
      res.json(req.expense);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static updateById = async (req: Request, res: Response) => {
    try {
      await req.expense.update(req.body);
      res.json('Expense updated successfully');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static deleteById = async (req: Request, res: Response) => {
    try {
      await req.expense.destroy();
      res.json('Expense deleted successfully');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}