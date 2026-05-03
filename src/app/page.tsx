import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Now in public beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
          Manage your team's work with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">absolute clarity</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Purpose-built for elite product teams. Streamline issues, projects, and product roadmaps with an ultra-fast, beautifully designed experience.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/register" 
            className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg bg-foreground px-8 font-medium text-background transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </Link>
          
          <Link 
            href="/login" 
            className="group flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-8 font-medium text-foreground transition-all hover:bg-muted/50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
