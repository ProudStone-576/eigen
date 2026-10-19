"use client";

import { InlineForm } from "@/components/console/Controls";
import { renameOrg } from "../actions";

export function RenameOrg({ name }: { name: string }) {
  return <InlineForm label="Organisation name" placeholder="Organisation name" submit="Save" initial={name} run={(v) => renameOrg({ name: v })} />;
}
