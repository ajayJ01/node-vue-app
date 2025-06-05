const Task = require('../models/Task');
const { success, error, validationError } = require('../utils/response');

exports.createTask = async (req, reply) => {
    try {
        const { title, description, dueDate, assignedTo } = req.body;

        // Check if all required fields are provided
        if (!title || !description || !dueDate || !assignedTo) {
            return error(reply, 400, 'All fields are required');
        }

        // If assignedTo is an array, create a task per user
        const tasks = Array.isArray(assignedTo)
            ? await Promise.all(
                assignedTo.map(userId =>
                    Task.create({
                        title,
                        description,
                        dueDate,
                        assignedTo: userId,
                        createdBy: req.user._id  // assuming you have middleware for setting req.user
                    })
                )
            )
            : [
                await Task.create({
                    title,
                    description,
                    dueDate,
                    assignedTo,
                    createdBy: req.user._id
                })
            ];

        return success(reply, 'Task(s) created successfully', tasks);

    } catch (err) {
        console.error('Task Creation Error:', err.message);
        return error(reply);
    }
};