'use client'
import { Trash2, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IMenuItem } from "@/types/menuItem.type";
import { deleteMenuItem } from "@/lib/actions/menuitems";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MenuDeleteDialog = ({item} : {item:IMenuItem}) => {
   const router = useRouter()

   const handleDeleteMenu =async () => {
      try {
         await deleteMenuItem(item._id as string)
         toast.success('Item Deleted')
         router.refresh()

      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Delete failed: ${message}`)
      }
   }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${item.itemName}`}
            title="Delete item"
            className="shrink-0 cursor-pointer"
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete menu?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this menu from storage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" className='cursor-pointer' onClick={handleDeleteMenu}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MenuDeleteDialog;
