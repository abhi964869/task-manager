"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, CheckCircle } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 h-16 z-50 glass-panel border-b border-border px-6 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:neon-shadow transition-all duration-300">
          <CheckCircle className="w-5 h-5 text-primary" />
        </div>
        <span className="font-semibold text-lg tracking-tight">Flow</span>
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-border mx-2"></div>
            <button 
              onClick={() => signOut()} 
              className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <div className="ml-2 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200">
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
