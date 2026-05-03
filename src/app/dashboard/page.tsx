"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, ListTodo, Loader2, PlayCircle, FolderKanban } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalTasks: number;
  totalProjects: number;
  statusBreakdown: {
    TODO: number;
    IN_PROGRESS: number;
    REVIEW: number;
    DONE: number;
  };
  overdueTasks: any[];
  recentTasks: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-6 space-y-8">
      <motion.div initial="hidden" animate="show" variants={container} className="space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {session?.user?.name}</p>
          </div>
          <Link href="/projects" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <FolderKanban className="w-4 h-4" />
            View Projects
          </Link>
        </div>

        {/* OVERDUE ALERTS */}
        {data.overdueTasks.length > 0 && (
          <motion.div variants={item} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-500">You have {data.overdueTasks.length} overdue tasks</h3>
              <p className="text-sm text-red-400/80 mt-1">Please review your tasks and update their status or due dates.</p>
            </div>
          </motion.div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item} className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <ListTodo className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Total Tasks</span>
            </div>
            <div className="text-3xl font-bold group-hover:text-blue-400 transition-colors">{data.totalTasks}</div>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <PlayCircle className="w-5 h-5 text-amber-400" />
              <span className="font-medium">In Progress</span>
            </div>
            <div className="text-3xl font-bold group-hover:text-amber-400 transition-colors">{data.statusBreakdown.IN_PROGRESS}</div>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Completed</span>
            </div>
            <div className="text-3xl font-bold group-hover:text-emerald-400 transition-colors">{data.statusBreakdown.DONE}</div>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <FolderKanban className="w-5 h-5 text-primary" />
              <span className="font-medium">Projects</span>
            </div>
            <div className="text-3xl font-bold group-hover:text-primary transition-colors">{data.totalProjects}</div>
          </motion.div>
        </div>

        {/* RECENT TASKS */}
        <motion.div variants={item} className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
          </div>
          <div className="divide-y divide-border">
            {data.recentTasks.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No tasks assigned to you yet.</div>
            ) : (
              data.recentTasks.map((task) => (
                <div key={task.id} className="p-4 px-6 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === "DONE" ? "bg-emerald-400" :
                      task.status === "IN_PROGRESS" ? "bg-amber-400" :
                      task.status === "REVIEW" ? "bg-purple-400" : "bg-blue-400"
                    }`} />
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{task.project.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-red-400" : "text-muted-foreground"}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium border border-border">
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
