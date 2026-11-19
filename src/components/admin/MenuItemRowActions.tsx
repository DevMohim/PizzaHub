"use client";

import { Check, Eye, EyeOff, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateApproveStatus} from "@/lib/actions/menuitems";
import { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";

interface MenuItemRowActionsProps {
  /** Menu item this row's actions operate on. */
  item: IMenuItem;
}

/**
 * Right-side action buttons for one admin menu-item row: Approve, Reject,
 * status toggle, and Delete. Client component — uses `useRouter` so the
 * table can refresh after an action.
 */
const MenuItemRowActions = ({ item }: MenuItemRowActionsProps) => {
  const status: MenuItemStatus = item.status ?? "pending";
  const name = item.itemName;

  const router = useRouter();

  const handleMenuApprove = async () => {
    try {
      await updateApproveStatus(item._id as string);
      router.refresh();
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  const approve =
    status === "pending" || status === "rejected" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Approve ${name}`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
        onClick={handleMenuApprove}
      >
        <Check aria-hidden="true" />
        Approve
      </Button>
    ) : null;

  const reject =
    status === "pending" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Reject ${name}`}
        className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
      >
        <X aria-hidden="true" />
        Reject
      </Button>
    ) : null;

  const toggleStatus =
    status === "approved" || status === "active" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Make ${name} inactive`}
        className="text-muted-foreground hover:text-foreground"
      >
        <EyeOff aria-hidden="true" />
        Make Inactive
      </Button>
    ) : status === "inactive" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Make ${name} active`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
      >
        <Eye aria-hidden="true" />
        Make Active
      </Button>
    ) : null;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {approve}
      {reject}
      {toggleStatus}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        aria-label={`Delete ${name}`}
      >
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
};

export default MenuItemRowActions;
