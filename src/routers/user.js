// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

////////////////////////// USERS //////////////////////////
// Create one user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send('Error: ' + e);
    }
});

// Login
router.post('/users/login', auth, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send('Error: ' + e);
    }
});

// Logout
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send('Error: ' + e);
    }
});

// Logout all users
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send('Error: ' + e);
    }
});

// Get all users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(user);
    } catch(e) {
        res.status(500).send('Error: ' + e);
    }
});

// Get me
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});


//Get User by ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user) {
             return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(500).send('Error: ' + e);
    }
});

// Get user by ID and update
router.patch('/users/:id', async(req, res) => {
    // Custom Validation starts
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every((update) =>  allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('error: not a valid update');
    }
    // Custom Validation ends

    const _id = req.params.id;
    const body = req.body;

    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
   
        
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(400).send('Error: ' + e);
    }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        return res.status(500).send('Error: ' + e);
    }
});

module.exports = router;