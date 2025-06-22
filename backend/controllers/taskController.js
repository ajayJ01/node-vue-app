const Task = require("../models/Task");
const { success, error, notFound } = require("../utils/response");
const { uploadFile } = require('../utils/fileUpload');

exports.createTask = async (req, reply) => {
  try {
    if (!req.isMultipart()) {
      return reply.status(400).send({ message: 'Request is not multipart' });
    }

    const parts = req.parts();
    const formData = {};
    let filePart = null;

    for await (const part of parts) {
      if (part.file && part.fieldname === 'file') {
        filePart = part;
        console.log('📦 File received:', part.filename);
      } else {
        formData[part.fieldname] = part.value;
        console.log('📩 Field received:', part.fieldname, '=', part.value);
      }
    }

    console.log('✅ Finished reading parts');

    const { title, description, dueDate, assignedTo } = formData;
    const assignedList = Array.isArray(assignedTo)
      ? assignedTo
      : [assignedTo];

    let fileUrl = null;

    if (filePart) {
      console.log('⬇ Uploading file...');
      fileUrl = await uploadFile(filePart, {
        folder: 'uploads/tasks',
        allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg', '.webp'],
        maxSizeMB: 5,
      });
      console.log('✅ File uploaded:', fileUrl);
    }

    console.log('🛠 Creating task...');
    const task = await Task.create({
      title,
      description,
      fileUrl,
      dueDate,
      assignedTo: assignedList,
      createdBy: req.user.id,
    });

    console.log('✅ Task created:', task._id);
    return success(reply, 'Task created & assigned successfully', task);
  } catch (err) {
    console.error('🚨 Task Creation Error:', err);
    return error(reply, 'Failed to create task');
  }
};

exports.updateTask = async (req, reply) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, assignedTo, status } = req.body;

    const assignedList = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

    const updated = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        dueDate,
        assignedTo: assignedList,
        ...(status && { status }) // only update if status is provided
      },
      { new: true }
    );

    if (!updated) {
      return notFound(reply, "Task not found");
    }

    return success(reply, "Task updated successfully", updated);
  } catch (err) {
    console.error("Task Update Error:", err);
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