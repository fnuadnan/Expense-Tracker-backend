
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).send('Access denied.');

        jwt.verify(token, process.env.JWT_SECRET);
        res.send({ isValid: true });

    } catch (error) {
        res.status(401).send('Invalid token.');
        console.error('Token verification error:', error);
    }
});

module.exports = router;