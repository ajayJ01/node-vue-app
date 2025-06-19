const Task = require("../models/Task");
const { success, error, notFound } = require("../utils/response");

exports.createTask = async (req, reply) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const assignedList = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

    const tasks = await Task.create({
      title,
      description,
      dueDate,
      assignedTo: assignedList,
      createdBy: req.user.id,
    });

    return success(reply, "Task created & assigned successfully", tasks);
  } catch (err) {
    console.error("Task Creation Error:", err);
    return error(reply);
  }
};

exports.getAllTasks = async (req, reply) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    const totalCount = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return success(reply, "Tasks fetched successfully", {
      tasks,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    return error(reply);
  }
};

exports.cancelTask = async (req, reply) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return notFound(reply, "Task not found");
    }

    if (task.status === 'cancelled') {
      return conflict(reply, 'Task is already cancelled');
    }

    task.status = "cancelled";
    task.updatedAt = new Date();
    await task.save();

    return success(reply, "Task cancelled successfully", task);
  } catch (err) {
    console.error("Cancel Task Error:", err);
    return error(reply);
  }
};