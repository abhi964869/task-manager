import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, projectId, assigneeId, dueDate, priority } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and Project ID are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId || undefined,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
