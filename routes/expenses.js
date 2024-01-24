
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateExpense } = require('../models/expense');
const { ZodError } = require('zod');
const auth = require('../middlewares/auth');
const router = express.Router();

const prisma = new PrismaClient();

router.get('/', auth, async(req, res) => {
    try {
        const expenses = await prisma.expense.findMany();
        res.send(expenses);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: "An unexpected error occured."});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        validateExpense(req.body);

        const expense = await prisma.expense.create({
            data: {
                description: req.body.description,
                amount: req.body.amount,
                category: req.body.category
            }
        });

        res.status(201).send(expense)

    } catch (error) {
        if(error instanceof ZodError) {
            res.status(400).send({errors: error.errors});
        } else {
            console.error(error);
            res.status(500).send({message: "An unexpected error occured."});
        }
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
      const expense = await prisma.expense.findUnique({ where: { id: req.params.id } });
      if (!expense) return res.status(400).send('The expense does not exist, so cannot be updated');

      validateExpense(req.body);

      const updatedExpense = await prisma.expense.update({
        where: { id: req.params.id },
        data: {
          description: req.body.description,
          amount: req.body.amount,
          category: req.body.category,
        },
      });
  
      res.send(updatedExpense);

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send({ errors: error.errors });
      } else {
        console.error(error);
        res.status(500).send({ message: 'An unexpected error occurred.' });
      }
    }
});


router.delete('/:id', auth, async(req, res) => {
    try {

        const expense = await prisma.expense.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!expense) return res.status(400).send('The expense does not exist, so cannot be deleted');

        const deleteExpense = await prisma.expense.delete({where: {id: parseInt(req.params.id)}});

        res.send(deleteExpense);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "An unexpected error occured."});
    }
});
  

module.exports = router;