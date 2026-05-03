import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // If admin, maybe they see all projects they own. If member, projects they are member of.
    // For tasks, we can show tasks assigned to them, or all tasks in their projects.
    // Let's show tasks assigned to the user.
    
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: { project: true }
    });

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === "TODO").length;
    const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length;
    const reviewTasks = tasks.filter(t => t.status === "REVIEW").length;
    const doneTasks = tasks.filter(t => t.status === "DONE").length;

    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE");

    const projects = await prisma.project.findMany({
      where: userRole === "ADMIN" 
        ? { ownerId: userId }
        : { members: { some: { id: userId } } }
    });

    return NextResponse.json({
      totalTasks,
      statusBreakdown: {
        TODO: todoTasks,
        IN_PROGRESS: inProgressTasks,
        REVIEW: reviewTasks,
        DONE: doneTasks
      },
      overdueTasks,
      totalProjects: projects.length,
      recentTasks: tasks.slice(0, 5) // Send some recent tasks
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
