"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function OrgSwitcher() {
  const { theme } = useTheme();

  return (
    <OrganizationSwitcher 
      appearance={{
        elements: {
          rootBox: "w-[300px]",
          organizationSwitcherTrigger: "py-2 px-4 rounded-lg border",
        }
      }}
    />
  );
}