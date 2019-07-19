// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

////////////////////////// TASKS //////////////////////////
// Create one Task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send('Cannot fulfill request');
    }
});


//Get Task by ID
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if(!task) {
             return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

// Get task by ID and update
router.patch('/tasks/:id', async(req, res) => {
    // Custom Validation starts
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((update) =>  allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('error: not a valid update');
    }
    // Custom Validation ends

    const _id = req.params.id;
    const body = req.body;

    try {
        const task = await Task.findByIdAndUpdate(_id, body, { new: true, runValidators: true });

        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

// Delete task by ID
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        return res.status(500).send();
    }
});

module.exports = router;