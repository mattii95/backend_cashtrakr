import { Router } from "express";
import { body } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInputs } from "../middleware/budget";

const router = Router();

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);

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

export default router;