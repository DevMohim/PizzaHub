"use client";

import { Ban, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user.type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { blockUser, unBlockedUser } from "@/lib/actions/user";

interface UserRowActionsProps {
  user: IUser;
}

const UserRowActions = ({ user }: UserRowActionsProps) => {
  const blocked = user.isBlocked ?? false;
  const name = user.name;
  const router = useRouter()

   const handleUserBlock = async () => {
     try {
       await blockUser(user._id);
       toast.success("User blocked successfully");
       router.refresh();
     } catch (error) {
       console.error("User block error:", error);
       toast.error("Failed to block user");
     }
   };

   const handleUserUnblock = async() => {
try {
  await unBlockedUser(user._id);
  toast.success("User blocked successfully");
  router.refresh();
} catch (error) {
  console.error("User block error:", error);
  toast.error("Failed to block user");
}
   }

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

      <Button
        type="button"
        variant={blocked ? "outline" : "destructive"}
        size="sm"
        aria-label={`${blocked ? "Unblock" : "Block"} ${name}`}
        className={
          blocked
            ? "border-success/40 text-success hover:bg-success/10 hover:text-success"
            : ""
        }
        onClick={blocked ? handleUserUnblock : handleUserBlock}
      >
        {blocked ? (
          <>
          <ShieldCheck aria-hidden='false' />
          Unblock
          </>
        ) : (
          <>
            <Ban aria-hidden="true" />
          Block</>
        )}
      </Button>
    </div>
  );
};

export default UserRowActions;
