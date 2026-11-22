"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  moderateMenuItem,
  updateApproveStatus,
  updateRejectStatus,
} from "@/lib/actions/menuitems";
import type { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";
import DeleteMenuItemsDialog from "./DeleteMenuItemsDialog";

interface MenuItemRowActionsProps {
  item: IMenuItem;
}

const MenuItemRowActions = ({ item }: MenuItemRowActionsProps) => {
  const status: MenuItemStatus = item.status ?? "pending";
  const name = item.itemName;
  const id = item._id;
  const isActive = item.active === true;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (
    action: () => Promise<unknown>,
    successMsg: string,
    errorMsg: string,
  ) =>
    startTransition(async () => {
      try {
        await action();
        toast.success(successMsg);
        router.refresh();
      } catch (error) {
        console.error(errorMsg, error);
        toast.error(error instanceof Error ? error.message : errorMsg);
      }
    });

  return (
    <div className="flex items-center justify-end gap-1.5">
      {status === "pending" && (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            aria-label={`Approve ${name}`}
            className="border-success/40 text-success hover:bg-success/10 hover:text-success"
            onClick={() =>
              run(
                () => updateApproveStatus(id),
                "Item approved",
                "Approve failed",
              )
            }
          >
            <Check aria-hidden="true" />
            Approve
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            aria-label={`Reject ${name}`}
            className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
            onClick={() =>
              run(
                () => updateRejectStatus(id),
                "Item rejected",
                "Reject failed",
              )
            }
          >
            <X aria-hidden="true" />
            Reject
          </Button>
        </>
      )}

      {/* Admin শুধু approved item এর active/inactive বদলাতে পারে */}
      {status === "approved" && isActive && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-label={`Make ${name} inactive`}
          className="text-muted-foreground hover:text-foreground"
          onClick={() =>
            run(
              () => moderateMenuItem(id, "inactive"),
              "Item is now inactive",
              "Make inactive failed",
            )
          }
        >
          <EyeOff aria-hidden="true" />
          Make Inactive
        </Button>
      )}

      {status === "approved" && !isActive && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-label={`Make ${name} active`}
          className="border-success/40 text-success hover:bg-success/10 hover:text-success"
          onClick={() =>
            run(
              () => moderateMenuItem(id, "approved"),
              "Item is now active",
              "Make active failed",
            )
          }
        >
          <Eye aria-hidden="true" />
          Make Active
        </Button>
      )}

      <DeleteMenuItemsDialog isPending={isPending} item={item} />
    </div>
  );
};

export default MenuItemRowActions;
