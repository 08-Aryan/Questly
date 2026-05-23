import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="group card bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-teal-500/30 transition-all duration-300 rounded-3xl shadow-lg">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <UsersIcon className="w-6 h-6 text-teal-400" />
            </div>
            <div className="badge bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-xs tracking-wider uppercase animate-pulse">
              Live
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1 tracking-tight">
            {activeSessionsCount}
          </div>
          <div className="text-sm text-slate-400 font-medium">Active Interview Rooms</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="group card bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 rounded-3xl shadow-lg">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <TrophyIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold text-xs tracking-wider uppercase">
              Completed
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1 tracking-tight">
            {recentSessionsCount}
          </div>
          <div className="text-sm text-slate-400 font-medium">Collaborated Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;