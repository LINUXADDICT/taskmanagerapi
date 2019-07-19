// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'carlosmejia');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(404).send('Please authenticate correctly' + e);
    }
};

module.exports = auth;