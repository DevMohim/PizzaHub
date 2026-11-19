"use client";

import { Ban, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user.type";

interface UserRowActionsProps {
  user: IUser;
}

/**
 * Right-side actions for the admin Manage Users table: view details
 * plus Block / Unblock (contextual to the account state).
 * Design only — wire up handlers when implementing functionality.
 */
const UserRowActions = ({ user }: UserRowActionsProps) => {
  const blocked = user.isBlocked ?? false;
  const name = user.name;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`View ${name}`}
        className="text-muted-foreground hover:text-foreground"
      >
        <Eye aria-hidden="true" />
        View
      </Button>

      {blocked ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Unblock ${name}`}
          className="border-success/40 text-success hover:bg-success/10 hover:text-success"
        >
          <ShieldCheck aria-hidden="true" />
          Unblock
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Block ${name}`}
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Ban aria-hidden="true" />
          Block
        </Button>
      )}
    </div>
  );
};

export default UserRowActions;
