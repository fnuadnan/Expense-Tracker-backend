
const z = require('zod');

const Category = ['Groceries', 'Entertainment', "Utilities"];

function validateExpense(expense) {
    const schema = z.object({
        description: z.string().min(2).max(20),
        amount: z.number().min(1).max(1000),
        category: z.enum(Category)
    })
    return schema.parse(expense);
}

module.exports = {validateExpense};