import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  Code2Icon,
  SparklesIcon,
  Users2Icon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-radial from-slate-900 via-zinc-950 to-black text-slate-100 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-xl bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-wide">
                Questly
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest -mt-0.5">
                Code Together
              </span>
            </div>
          </Link>

          {/* AUTH BUTTON */}
          <SignInButton mode="modal">
            <button className="group px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Neon Backdrop Glows (Much softer and cleaner) */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN - TEXT CONTENT */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <ZapIcon className="size-3.5 fill-teal-300" />
              <span>Real-Time Code Collaboration</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Code{" "}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Collaboratively.
              </span>
              <br />
              Succeed Together.
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              The ultimate coding assessment and collaborative whiteboard environment. 
              Run live programming interviews, collaborate on practice problems, and level up your pair-programming workflow in real-time.
            </p>

            {/* FLOATING PILLS */}
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-slate-300">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                Live Video Rooms
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-slate-300">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                Monaco Code Editor
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-slate-300">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                Multi-Language Compiler
              </span>
            </div>

            {/* CALL TO ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg bg-gradient-to-r from-teal-500 to-emerald-600 border-none text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:-translate-y-0.5">
                  Start Coding Now
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <Link to="/problems">
                <button className="btn btn-outline btn-lg border-zinc-800 hover:bg-zinc-800 text-slate-300 rounded-xl">
                  <Code2Icon className="size-5" />
                  View Sandbox
                </button>
              </Link>
            </div>

            {/* KEYLESS METRICS DISPLAY */}
            <div className="pt-6">
              <div className="inline-flex bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 gap-4">
                <div className="px-6 py-2 text-center">
                  <div className="text-2xl font-black text-teal-400">10+</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Users</div>
                </div>
                <div className="w-[1px] bg-zinc-800 my-2"></div>
                <div className="px-6 py-2 text-center">
                  <div className="text-2xl font-black text-emerald-400">100+</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rooms Closed</div>
                </div>
                <div className="w-[1px] bg-zinc-800 my-2"></div>
                <div className="px-6 py-2 text-center">
                  <div className="text-2xl font-black text-slate-300">99.9%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - PREMIUM IMAGE INTERFACE */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Glowing Ring Border effect around the image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-emerald-600 opacity-10 rounded-3xl blur-2xl -z-10"></div>
            <img
              src="/hero.png"
              alt="Questly Collaborative Dashboard"
              className="w-full max-w-md lg:max-w-none h-auto rounded-3xl shadow-2xl border border-zinc-800 hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* CORE CAPABILITIES GRID */}
      <div className="border-t border-zinc-800 bg-zinc-950/45 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Everything You Need to <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-slate-400">
              Powerful, highly responsive, and robust integrations designed to make technical evaluations fluid and seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FEATURE 1 */}
            <div className="card bg-zinc-900/30 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 transition-all duration-300 p-6 rounded-2xl">
              <div className="card-body p-2 items-center text-center space-y-4">
                <div className="size-14 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <VideoIcon className="size-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white">HD Video Rooms</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Real-time face-to-face video and voice chat integrated natively beside the collaborative code console.
                </p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="card bg-zinc-900/30 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 transition-all duration-300 p-6 rounded-2xl">
              <div className="card-body p-2 items-center text-center space-y-4">
                <div className="size-14 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <Code2Icon className="size-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Collaborative IDE</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Powered by Monaco Editor for professional syntax coloring, tab completions, and responsive code state sync.
                </p>
              </div>
            </div>

            {/* FEATURE 3 */}
            <div className="card bg-zinc-900/30 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 transition-all duration-300 p-6 rounded-2xl">
              <div className="card-body p-2 items-center text-center space-y-4">
                <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Users2Icon className="size-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Public Sandbox</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Fully operational compiler proxy routing submissions through Judge0 public servers for seamless and instant code outputs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;