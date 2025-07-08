const cron = require("node-cron");
const Task = require("../models/Task");
const mongoose = require("mongoose");

if (!mongoose.connection.readyState) {
  console.log("⚠️ Mongoose not connected. Cron may fail.");
}

// Run every 1 minutes
cron.schedule("*/1 * * * *", async () => {
  const now = new Date();

  try {
    const result = await Task.updateMany(
      {
        dueDate: { $lt: now },
        status: { $in: ["pending", "in_progress"] },
      },
      { $set: { status: "due" } }
    );

    const count = result.modifiedCount ?? result.nModified ?? "unknown";
    console.log(`[CRON] ✅ Updated ${count} due tasks`);
  } catch (err) {
    console.error("[CRON] ❌ Error updating due tasks:", err);
  }
});
