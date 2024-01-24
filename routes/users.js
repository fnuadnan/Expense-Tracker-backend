
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { validateUser } = require('../models/user');
const { PrismaClient } = require('@prisma/client');
const { ZodError } = require('zod');
const router = express.Router();

const prisma = new PrismaClient();

router.post('/', async(req, res) => {
    try {
        validateUser(req.body);

        const userExist = await prisma.user.findUnique({where: {email: req.body.email}});
        if(userExist) return res.status(400).send('The user already exist')

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        });
        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET);
        res.header('x-auth-token', token).status(201).send(_.pick(newUser, ['id', 'name', 'email']));
        

    } catch (error) {
        if(error instanceof ZodError) {
            res.status(400).send({errors: error.errors});
        } else {
            console.error(error);
            res.status(500).send({message: "An unexpected error occured."});
        }
    }
});


module.exports = router;
