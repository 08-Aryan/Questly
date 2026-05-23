import { Code2, Clock, Users, Trophy, Loader2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="card bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-teal-500/25 transition-all duration-300 mt-8 rounded-3xl shadow-xl">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-xl shadow-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
              <Loader2Icon className="w-10 h-10 animate-spin text-teal-400" />
              <p className="text-sm text-slate-400">Loading past records...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="group card bg-zinc-950/40 border border-zinc-800 hover:border-teal-500/20 transition-all duration-300 rounded-2xl shadow-md"
              >
                <div className="card-body p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-md group-hover:rotate-3 transition-transform duration-300">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-white text-base mb-1.5 truncate">{session.problem}</h3>
                      <span
                        className={`badge badge-sm font-semibold border-none py-1.5 ${getDifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 font-medium mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-400/70" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400/70" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <span>Completed</span>
                    <span>
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 border border-zinc-800 rounded-3xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-teal-400/50" />
              </div>
              <p className="text-base font-bold text-white mb-1">No past sessions yet</p>
              <p className="text-sm text-slate-500">Ace your coding journey by starting your first session!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;