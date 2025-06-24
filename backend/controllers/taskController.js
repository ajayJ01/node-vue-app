const Task = require("../models/Task");
const { success, error, notFound } = require("../utils/response");
const { uploadFile } = require("../utils/fileUpload");

exports.createTask = async (req, reply) => {
  try {
    if (!req.isMultipart()) {
      return reply.status(400).send({ message: "Request is not multipart" });
    }

    const parts = req.parts();
    const formData = {};
    let filePartData = null;

    // Iterate and process all multipart parts (fields and files)
    // This ensures all incoming stream data is consumed, preventing hangs.
    for await (const part of parts) {
      if (part.file && part.fieldname === "file") {
        // Buffer the file stream to ensure full consumption
        const buffer = await part.toBuffer();

        filePartData = {
          fieldname: part.fieldname,
          filename: part.filename,
          mimetype: part.mimetype,
          encoding: part.encoding,
          buffer: buffer,
        };
      } else if (part.type === "field") {
        if (formData[part.fieldname]) {
          if (Array.isArray(formData[part.fieldname])) {
            formData[part.fieldname].push(part.value);
          } else {
            formData[part.fieldname] = [formData[part.fieldname], part.value];
          }
        } else {
          formData[part.fieldname] = part.value;
        }
      } else {
        if (part.file) {
          await part.toBuffer();
        }
      }
    }

    const { title, description, dueDate, assignedTo } = formData;

    // Ensure assignedTo is always an array
    const assignedList = Array.isArray(assignedTo)
      ? assignedTo
      : assignedTo
      ? [assignedTo]
      : [];

    let fileUrl = null;

    // Process file upload if a file was provided
    if (filePartData) {
      fileUrl = await uploadFile(filePartData, {
        folder: "uploads/tasks",
        allowedExtensions: [".pdf", ".png", ".jpg", ".jpeg", ".webp"],
        maxSizeMB: 5,
      });
    } else {
      console.log("ℹ️ No file provided for upload.");
    }

    const task = await Task.create({
      title,
      description,
      fileUrl,
      dueDate,
      assignedTo: assignedList,
      createdBy: req.user.id,
    });

    return success(reply, "Task created & assigned successfully", task);
  } catch (err) {
    console.error("🚨 Task Creation Error:", err);
    return error(reply, "Failed to create task", err.message);
  }
};

exports.updateTask = async (req, reply) => {
  try {
    if (!req.isMultipart()) {
      return reply.status(400).send({ message: "Request is not multipart" });
    }

    const parts = req.parts();
    const formData = {};
    let filePartData = null;

    for await (const part of parts) {
      if (part.file && part.fieldname === "file") {
        const buffer = await part.toBuffer();
        filePartData = {
          fieldname: part.fieldname,
          filename: part.filename,
          mimetype: part.mimetype,
          encoding: part.encoding,
          buffer: buffer,
        };
      } else if (part.type === "field") {
        if (formData[part.fieldname]) {
          if (Array.isArray(formData[part.fieldname])) {
            formData[part.fieldname].push(part.value);
          } else {
            formData[part.fieldname] = [formData[part.fieldname], part.value];
          }
        } else {
          formData[part.fieldname] = part.value;
        }
      } else {
        if (part.file) {
          await part.toBuffer();
        }
      }
    }

    const { title, description, dueDate, assignedTo, status } = formData;
    const assignedList = Array.isArray(assignedTo)
      ? assignedTo
      : assignedTo
      ? [assignedTo]
      : [];

    let fileUrl = null;
    if (filePartData) {
      fileUrl = await uploadFile(filePartData, {
        folder: "uploads/tasks",
        allowedExtensions: [".pdf", ".png", ".jpg", ".jpeg", ".webp"],
        maxSizeMB: 5,
      });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        dueDate,
        assignedTo: assignedList,
        ...(status && { status }),
        ...(fileUrl && { fileUrl }),
      },
      { new: true }
    );

    if (!updated) {
      return notFound(reply, "Task not found");
    }

    return success(reply, "Task updated successfully", updated);
  } catch (err) {
    console.error("🚨 Task Update Error:", err);
    return error(reply, "Failed to update task", err.message);
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

    if (task.status === "cancelled") {
      return conflict(reply, "Task is already cancelled");
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
