import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { ExpenseController } from "../controllers/ExpenseController";
import { handleInputErrors } from "../middleware/validation";
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInputs } from "../middleware/budget";
import { validateExpenseExists, validateExpenseId, validateExpenseInputs } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);
router.param('budgetId', hasAccess);

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);

router.post('/',
    validateBudgetInputs,
    handleInputErrors,
    BudgetController.create
)

router.get('/', BudgetController.getAll)

router.get('/:budgetId', BudgetController.getById)

router.put('/:budgetId',
    validateBudgetInputs,
    handleInputErrors,
    BudgetController.updateById
)

router.delete('/:budgetId', BudgetController.deleteById)

/** Routes for expenses */
/** Arquitectura ROA */
router.post('/:budgetId/expenses',
    validateExpenseInputs,
    handleInputErrors,
    ExpenseController.create
);
router.get('/:budgetId/expenses/:expenseId', ExpenseController.getById);
router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInputs,
    handleInputErrors,
    ExpenseController.updateById
);
router.delete('/:budgetId/expenses/:expenseId', ExpenseController.deleteById);

export default router;