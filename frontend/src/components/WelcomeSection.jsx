import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden bg-radial from-teal-900/10 via-transparent to-transparent">
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-base md:text-lg text-slate-400 pl-1">
              Ready to collaborate, test your skills, and ace your technical interviews?
            </p>
          </div>

          <button
            onClick={onCreateSession}
            className="group px-7 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <ZapIcon className="w-5 h-5 fill-white/20" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;