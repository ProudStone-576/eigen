import { requireAdmin } from "@/lib/auth/context";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { ConsoleNav } from "@/components/console/ConsoleNav";

export const metadata = { title: { default: "Administration", template: "%s · Administration · Eigen" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="tb-label">
            Administration · {ROLE_LABEL[ctx.role]}
          </p>
          <h1 className="font-serif text-3xl font-semibold mt-1">{ctx.org.name}</h1>
        </div>
        <ConsoleNav
          links={[
            { href: "/admin", label: "Overview", exact: true },
            { href: "/admin/analytics", label: "Analytics" },
            { href: "/admin/members", label: "Members" },
            { href: "/teacher", label: "Classes" },
            { href: "/admin/invitations", label: "Invitations" },
            { href: "/admin/audit", label: "Audit log" },
            { href: "/admin/settings", label: "Settings" },
          ]}
        />
      </header>
      {children}
    </div>
  );
}
