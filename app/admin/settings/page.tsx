import { requireAdmin } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { RenameOrg } from "./RenameOrg";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const ctx = await requireAdmin();
  const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.org.id } });
  return (
    <div className="max-w-2xl space-y-8">
      <RenameOrg name={org.name} />
      <dl className="space-y-2 text-sm">
        {[
          ["Handle", org.slug],
          ["Student seats", org.seatLimit === null ? "Unlimited" : String(org.seatLimit)],
          ["Created", org.createdAt.toISOString().slice(0, 10)],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline">
            <dt className="text-[var(--muted)]">{k}</dt>
            <span className="dotleader" />
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-[var(--muted)]">Seat limits are set by the platform operator. Contact them to change your plan.</p>
    </div>
  );
}
