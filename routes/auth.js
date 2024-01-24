
const { PrismaClient } = require('@prisma/client');
const z = require('zod');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { ZodError } = require('zod');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

router.post('/', async(req, res) => {
    try {
        validate(req.body);

        const user = await prisma.user.findUnique({where: {email: req.body.email}});
        if(!user) return res.status(400).send('Invalid email or password');

        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if(!validatePassword) return res.status(400).send('Invalid email or password');

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
        res.send(token);

    } catch (error) {
        if(error instanceof ZodError) {
            res.status(400).send({errors: error.errors});
        } else {
            console.error(error);
            res.status(500).send({message: "An unexpected error occured."});
        }
    }
});



function validate(user) {
    const schema = z.object({
        email: z.string().min(5).max(30).email(),
        password: z.string().min(5).max(15)
    });
    return schema.parse(user);
};


module.exports = router;
