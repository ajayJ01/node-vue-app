const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "submitted",
        "verified",
        "cancelled",
        "due",
      ],
      default: "pending",
    },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
    fileUrl: { type: String, default: null },
    submissionNotes: { type: String, default: '' },
    submissionFileUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
