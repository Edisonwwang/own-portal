import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "H" },
  { href: "/journal", label: "Journal", icon: "J" },
  { href: "/mood", label: "Mood", icon: "M" },
  { href: "/finance", label: "Finance", icon: "F" }
];

function NavLinks() {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm text-stone-300 hover:bg-stone-900 hover:text-amber-200"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-800 text-xs text-amber-200">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-stone-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-56 border-r border-stone-800 bg-[#111111] p-4 md:block">
        <div className="mb-8 px-3 text-sm font-semibold tracking-wide text-stone-100">Personal Portal</div>
        <nav className="space-y-1">
          <NavLinks />
        </nav>
      </aside>
      <main className="pb-24 md:ml-56 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-4 border-t border-stone-800 bg-[#111111] p-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md text-xs text-stone-300 hover:bg-stone-900 hover:text-amber-200"
          >
            <span className="text-amber-200">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
