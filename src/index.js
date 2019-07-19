// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const express = require('express');
require('./db/mongoose');
// const User = require('./models/user');
// const Task = require('./models/task');
const userRouter = require ('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

//middleware to put API on maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('API is under maintenance');
// });

//Routes
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('App listening on port: ' + port);
});

