import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  Loader2Icon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 card bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-teal-500/20 transition-all duration-300 h-full rounded-3xl shadow-xl">
      <div className="card-body p-6">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-xl shadow-lg">
              <ZapIcon className="size-5 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Live Interview Rooms</h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="size-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2Icon className="size-10 animate-spin text-teal-400" />
              <p className="text-sm text-slate-400">Loading live rooms...</p>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="group/item card bg-zinc-950/40 border border-zinc-800 hover:border-teal-500/20 transition-all duration-300 rounded-2xl"
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative size-12 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
                      <Code2Icon className="size-6 text-white" />
                      <div className="absolute -top-0.5 -right-0.5 size-3 bg-emerald-400 rounded-full border border-zinc-900" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h3 className="font-extrabold text-white text-base truncate max-w-[200px] md:max-w-xs">{session.problem}</h3>
                        <span
                          className={`badge badge-sm font-semibold border-none py-1.5 ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                          <CrownIcon className="size-3.5 text-amber-400" />
                          <span>{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="size-3.5 text-teal-400" />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">FULL</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button className="btn btn-sm opacity-30 border-zinc-800 text-white/50 cursor-not-allowed rounded-xl">Full</button>
                  ) : (
                    <Link
                      to={`/session/${session._id}`}
                      className="btn btn-sm bg-gradient-to-r from-teal-500 to-emerald-600 border-none text-white font-bold rounded-xl shadow-md hover:shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-3.5 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 border border-zinc-800 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-teal-400/50" />
              </div>
              <p className="text-base font-bold text-white mb-1">No active interview rooms</p>
              <p className="text-sm text-slate-500">Be the first to create a collaborative session!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;