
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).send('Access denied.');

        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).send('Invalid token.');
        console.error(error);
    }
};