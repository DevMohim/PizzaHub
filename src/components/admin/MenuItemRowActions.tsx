"use client";

import { Check, Eye, EyeOff, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  updateApproveStatus,
  updateRejectStatus,
  updateInactiveStatus,
  updateActiveStatus,
} from "@/lib/actions/menuitems";
import { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";

interface MenuItemRowActionsProps {
  item: IMenuItem;
}

const MenuItemRowActions = ({ item }: MenuItemRowActionsProps) => {
  const status: MenuItemStatus = item.status ?? "pending";
  const name = item.itemName;
  const id = item._id as string;
  const isActive = item.active !== false;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (
    action: (id: string) => Promise<unknown>,
    successMsg: string,
    errorMsg: string,
  ) =>
    startTransition(async () => {
      try {
        await action(id);
        toast.success(successMsg);
        router.refresh();
      } catch (error) {
        console.error(errorMsg, error);
        toast.error(errorMsg);
      }
    });

  const approve =
    status === "pending" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        aria-label={`Approve ${name}`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
        onClick={() =>
          run(updateApproveStatus, "Item approved", "Approve failed")
        }
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
        disabled={isPending}
        aria-label={`Reject ${name}`}
        className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
        onClick={() =>
          run(updateRejectStatus, "Item rejected", "Reject failed")
        }
      >
        <X aria-hidden="true" />
        Reject
      </Button>
    ) : null;

  const toggleStatus =
    status !== "approved" ? null : isActive ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        aria-label={`Make ${name} inactive`}
        className="text-muted-foreground hover:text-foreground"
        onClick={() =>
          run(
            updateInactiveStatus,
            "Item is now inactive",
            "Make inactive failed",
          )
        }
      >
        <EyeOff aria-hidden="true" />
        Make Inactive
      </Button>
    ) : (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        aria-label={`Make ${name} active`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
        onClick={() =>
          run(updateActiveStatus, "Item is now active", "Make active failed")
        }
      >
        <Eye aria-hidden="true" />
        Make Active
      </Button>
    );

  return (
    <div className="flex items-center justify-end gap-1.5">
      {approve}
      {reject}
      {toggleStatus}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        aria-label={`Delete ${name}`}
      >
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
};

export default MenuItemRowActions;
