import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-full items-center justify-between px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            TaskHub
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative flex items-center gap-4" ref={menuRef}>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {session.user?.name ?? "ユーザー"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {session.user?.email ?? ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "profile"}
                      fill
                      sizes="36px"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {session.user?.name?.[0] ?? "U"}
                    </span>
                  )}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-14 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        void signOut({ callbackUrl: "/signin" });
                      }}
                      className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn("google")}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold transition hover:border-white/40"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="pt-6">{children}</div>
    </div>
  );
};

export default AppLayout;
