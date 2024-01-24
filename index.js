
const express = require('express');
const app = express();


require('./startups/routes')(app, express);


const port = process.env.PORT | 3000;
app.listen(port, () => console.log(`Listenning to port ${port}`));