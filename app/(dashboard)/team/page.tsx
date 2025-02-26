"use client";

import { RBACGate } from "@/components/rbac-gate";
import { Card } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Management</h1>
      
      <RBACGate allowedRoles={["admin"]}>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Admin Controls</h2>
          {/* Admin-only features */}
        </Card>
      </RBACGate>

      <RBACGate action="read">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          {/* Team member list visible to all roles with read access */}
        </Card>
      </RBACGate>
    </div>
  );
}