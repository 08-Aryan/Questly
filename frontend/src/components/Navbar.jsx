import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-[1.01] transition-all duration-300"
        >
          <div className="size-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
            <SparklesIcon className="size-5.5 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-xl bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent font-sans tracking-wide">
              Questly
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest -mt-0.5">
              Code Together
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-2">
          {/* PROBLEMS LINK */}
          <Link
            to="/problems"
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm flex items-center gap-2 border
              ${
                isActive("/problems")
                  ? "bg-teal-500/10 text-teal-300 border-teal-500/30 shadow-md shadow-teal-950/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-zinc-800 border-transparent"
              }`}
          >
            <BookOpenIcon className="size-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          {/* DASHBOARD LINK */}
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm flex items-center gap-2 border
              ${
                isActive("/dashboard")
                  ? "bg-teal-500/10 text-teal-300 border-teal-500/30 shadow-md shadow-teal-950/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-zinc-800 border-transparent"
              }`}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* CLERK PROFILE */}
          <div className="ml-2 pl-2 border-l border-zinc-800 flex items-center justify-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;