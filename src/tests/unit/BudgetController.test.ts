import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../mocks/budgets"
import { BudgetController } from '../../controllers/BudgetController'
import Budgets from '../../models/Budget'

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn()
}))

describe('BudgetController.getAll', () => {

    beforeEach(() => {
        (Budgets.findAll as jest.Mock).mockReset();
        (Budgets.findAll as jest.Mock).mockImplementation((options) => {
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudgets);
        });
    });

    it('should retrieve 2 budgets for user with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('should retrieve 1 budget for user with ID 2', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('should retrieve 0 budgets for user with ID 10', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });

    it('should handle errors when fetching budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }
        });
        const res = createResponse();

        (Budgets.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Internal server error' });
    });
});