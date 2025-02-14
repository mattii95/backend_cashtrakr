import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator';
import Budgets from '../models/Budget';

declare global {
    namespace Express {
        interface Request {
            budget?: Budgets
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId')
        .isInt().withMessage('ID no valido.')
        .custom((value) => value > 0).withMessage('ID no valido')
        .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budgets.findByPk(budgetId);
        if (!budget) {
            const error = new Error('Budget not found.');
            res.status(404).json({ error: error.message });
            return;
        }
        req.budget = budget;
        next();
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const validateBudgetInputs = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio.')
        .run(req);

    await body('amount')
        .notEmpty().withMessage('La cantidad del presupuesto no puede ir vacio.')
        .isNumeric().withMessage('La cantidad no es valida.')
        .custom((value) => value > 0).withMessage(' El presupuesto debe ser mayor a 0')
        .run(req);
        
    next()
}