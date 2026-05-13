
import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import Task from "@/models/Task";

async function checkDB() {
  await connectDB();
  const workspaces = await Workspace.find({});
  console.log("Workspaces count:", workspaces.length);
  if (workspaces.length > 0) {
    console.log("First workspace ID:", workspaces[0]._id);
  } else {
    console.log("No workspaces found!");
  }
  const tasks = await Task.find({});
  console.log("Tasks count:", tasks.length);
  process.exit(0);
}

checkDB();
