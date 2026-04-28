import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Check onboarding
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true },
  });

  if (!user?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const firstName = session.user.name?.split(" ")[0] ?? "Usuário";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(10, 10, 15, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            <span>🔥</span>
            <span className="hidden sm:inline">DailyForge</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <NavLink href="/dashboard" icon="📊" label="Dashboard" />
            <NavLink href="/history" icon="📅" label="Histórico" />
            <NavLink href="/profile" icon="👤" label="Perfil" />
          </div>

          {/* User */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
              }}
            >
              Sair
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]"
      style={{
        color: "var(--text-secondary)",
      }}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
