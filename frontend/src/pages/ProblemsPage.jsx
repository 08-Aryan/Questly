import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, SparklesIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-zinc-950 to-black text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Practice Arena</h1>
            <p className="text-sm text-slate-400">
              Ace your upcoming technical interviews with our collection of curated challenges.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <SparklesIcon className="size-3.5 fill-teal-300/20" />
            <span>{problems.length} Curated Problems</span>
          </div>
        </div>

        {/* CURATED PROBLEMS CATALOG */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="group card bg-zinc-900/35 backdrop-blur-md border border-zinc-800 hover:border-teal-500/25 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5"
            >
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* LEFT DETAILS */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="size-11 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/15 group-hover:scale-105 transition-transform duration-300">
                      <Code2Icon className="size-5.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors duration-300">
                          {problem.title}
                        </h2>
                        <span
                          className={`badge badge-sm font-semibold border-none py-1.5 ${getDifficultyBadgeClass(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                        {problem.category}
                      </p>
                      <p className="text-sm text-slate-300/90 leading-relaxed pt-1 line-clamp-2">
                        {problem.description.text}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold text-sm ml-12 md:ml-0 group-hover:text-teal-300 transition-colors">
                    <span>Solve Challenge</span>
                    <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PROGRESS METRICS WIDGET */}
        <div className="mt-12 card bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl shadow-xl">
          <div className="card-body p-8">
            <h3 className="text-sm uppercase font-bold text-slate-500 tracking-widest mb-4">
              Difficulty Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-zinc-950/40 p-4 border border-zinc-800 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</div>
                <div className="text-3xl font-extrabold text-white mt-1">{problems.length}</div>
              </div>

              <div className="bg-zinc-950/40 p-4 border border-zinc-800 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Easy</div>
                <div className="text-3xl font-extrabold text-emerald-300 mt-1">{easyProblemsCount}</div>
              </div>

              <div className="bg-zinc-950/40 p-4 border border-zinc-800 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Medium</div>
                <div className="text-3xl font-extrabold text-amber-300 mt-1">{mediumProblemsCount}</div>
              </div>

              <div className="bg-zinc-950/40 p-4 border border-zinc-800 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Hard</div>
                <div className="text-3xl font-extrabold text-rose-300 mt-1">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;