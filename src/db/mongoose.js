// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const mongoose = require('mongoose');
const connectionURL = "mongodb://127.0.0.1:27017/taskmanagerapi";

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
