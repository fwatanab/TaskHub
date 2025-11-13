import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignInPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const callbackUrl = (router.query.callbackUrl as string) || "/";

  useEffect(() => {
    if (status === "authenticated") {
      void router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">TaskHub</p>
        <h1 className="text-3xl font-semibold text-white">サインイン</h1>
        <p className="text-sm text-slate-300">
          あなた専用のタスクボードを開きましょう。
        </p>
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
        disabled={status === "loading"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M12 11v3.6h5.093A4.857 4.857 0 0 1 12 19.714 7.715 7.715 0 0 1 4.286 12 7.715 7.715 0 0 1 12 4.286c1.768 0 3.374.627 4.638 1.674l2.586-2.586A11.944 11.944 0 0 0 12 0C5.373 0 0 5.373 0 12s5.373 12 12 12a12 12 0 0 0 11.789-10.243H12Z" />
        </svg>
        Sign in with Google
      </button>
    </main>
  );
};

export default SignInPage;
