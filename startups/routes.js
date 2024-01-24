
const cors = require('cors');
const auth = require('../routes/auth');
const expenses = require('../routes/expenses');
const users = require('../routes/users');
const verifyToken = require('../routes/verifyToken');

module.exports = function (app, express) {
    // to expose the header from users.js for the token
    const corsOptions = {
        exposedHeaders: 'x-auth-token',
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/expenses', expenses);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/auth/verifytoken', verifyToken);
};


