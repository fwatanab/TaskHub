import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TaskBoard from "@/components/tasks/TaskBoard";

const insights = [
  { label: "フォーカスタイム", value: "3h 20m" },
  { label: "未完了タスク", value: "12" },
  { label: "完了率", value: "68%" },
];

const Home = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.replace("/signin");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 text-slate-400">
        Checking session...
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:px-0">
      <section className="flex flex-col gap-4 text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          TaskHub
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          目標達成を加速させる
          <span className="block text-violet-400">スマートなタスク管理</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-300">
          リアルタイムで進捗を把握し、チーム全体の集中力を高めるシンプルな体験を。
          CRUD 機能を段階的に拡張しながら理想のワークフローを構築しましょう。
        </p>
      </section>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <TaskBoard />
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">今日のインサイト</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Insight
            </span>
          </div>
          <ul className="mt-6 space-y-4">
            {insights.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </p>
                <p className="text-3xl font-semibold text-white">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Home;
