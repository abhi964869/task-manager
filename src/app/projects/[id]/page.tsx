"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, X, Calendar, User, ListTodo, Trash2, Settings, Users } from "lucide-react";

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const json = await res.json();
      setData(json);
      if (json.project?.members) {
        setSelectedMembers(json.project.members.map((m: any) => m.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assigneeId = formData.get("assigneeId") as string;
    const dueDate = formData.get("dueDate") as string;
    const priority = formData.get("priority") as string;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          projectId, 
          assigneeId: assigneeId || null, 
          priority,
          dueDate: dueDate || null 
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProject();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setData((prev: any) => ({
        ...prev,
        project: {
          ...prev.project,
          tasks: prev.project.tasks.map((t: any) => t.id === taskId ? { ...t, status: newStatus } : t)
        }
      }));

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
      fetchProject();
    }
  };

  const handlePriorityChange = async (taskId: string, newPriority: string) => {
    try {
      setData((prev: any) => ({
        ...prev,
        project: {
          ...prev.project,
          tasks: prev.project.tasks.map((t: any) => t.id === taskId ? { ...t, priority: newPriority } : t)
        }
      }));

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
    } catch (e) {
      console.error(e);
      fetchProject();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setData((prev: any) => ({
        ...prev,
        project: {
          ...prev.project,
          tasks: prev.project.tasks.filter((t: any) => t.id !== taskId)
        }
      }));
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      fetchProject();
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Are you absolutely sure you want to delete this project? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) router.push("/projects");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedMembers }),
      });
      if (res.ok) {
        setIsMembersModalOpen(false);
        fetchProject();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { project, users } = data;
  const statuses = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "URGENT": return "text-red-500 bg-red-500/10";
      case "HIGH": return "text-amber-500 bg-amber-500/10";
      case "MEDIUM": return "text-blue-500 bg-blue-500/10";
      case "LOW": return "text-muted-foreground bg-muted";
      default: return "";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full p-6 space-y-8 flex-1 flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description || "No description."}</p>
        </div>
        {session?.user?.role === "ADMIN" && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMembersModalOpen(true)}
              className="bg-card hover:bg-muted border border-border px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
            >
              <Users className="w-4 h-4" />
              Members
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
            <button 
              onClick={handleDeleteProject}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm border border-red-500/20"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {statuses.map(status => {
          const tasks = project.tasks.filter((t: any) => t.status === status);
          
          return (
            <div key={status} className="flex flex-col bg-card/50 border border-border rounded-xl p-4 min-w-[320px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground/80 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === "DONE" ? "bg-emerald-400" :
                    status === "IN_PROGRESS" ? "bg-amber-400" :
                    status === "REVIEW" ? "bg-purple-400" : "bg-blue-400"
                  }`} />
                  {status.replace("_", " ")}
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {tasks.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                <AnimatePresence>
                  {tasks.map((task: any) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-panel p-4 rounded-lg border border-border hover:border-primary/40 transition-colors group relative"
                    >
                      {session?.user?.role === "ADMIN" && (
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 mb-2 pr-6">
                        {session?.user?.role === "ADMIN" ? (
                          <select
                            value={task.priority}
                            onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border-none appearance-none cursor-pointer outline-none ${getPriorityColor(task.priority)}`}
                          >
                            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        ) : (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>

                      <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors pr-6">{task.title}</h4>
                      
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {task.assignee && (
                            <div className="flex items-center gap-1" title={task.assignee.name}>
                              <User className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[80px]">{task.assignee.name}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && status !== "DONE" ? "text-red-400 font-medium" : ""}`}>
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {/* Status Select */}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="bg-transparent text-xs font-medium border-none focus:ring-0 cursor-pointer appearance-none outline-none text-right hover:text-primary transition-colors"
                        >
                          {statuses.map(s => (
                            <option key={s} value={s} className="bg-background text-foreground">{s.replace("_", " ")}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-sm text-muted-foreground/50">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6">Create New Task</h2>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input 
                    name="title" 
                    required 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Task title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    name="description" 
                    rows={3}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                    placeholder="Add details..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign To</label>
                    <select 
                      name="assigneeId"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      <option value="">Unassigned</option>
                      {users.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      name="priority"
                      defaultValue="MEDIUM"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <input 
                    type="date"
                    name="dueDate" 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Members Modal */}
      <AnimatePresence>
        {isMembersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative"
            >
              <button onClick={() => setIsMembersModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-2">Project Members</h2>
              <p className="text-sm text-muted-foreground mb-6">Select users to add them to this project.</p>
              
              <form onSubmit={handleUpdateMembers} className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {users.map((user: any) => {
                    const isOwner = user.id === project.ownerId;
                    return (
                      <label key={user.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isOwner ? 'border-primary/30 bg-primary/5' : 'border-border hover:bg-muted/50'} cursor-pointer transition-colors`}>
                        <input 
                          type="checkbox"
                          checked={selectedMembers.includes(user.id)}
                          onChange={() => toggleMember(user.id)}
                          disabled={isOwner}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        {isOwner && <span className="text-xs font-bold text-primary">Owner</span>}
                      </label>
                    );
                  })}
                </div>
                
                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-4">
                  <button type="button" onClick={() => setIsMembersModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
