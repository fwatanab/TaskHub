import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TaskBoard from "@/components/tasks/TaskBoard";

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
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:px-10">
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
    <div className="grid gap-6 lg:grid-cols-1">
      <TaskBoard />
    </div>
    </main>
  );
};

export default Home;
