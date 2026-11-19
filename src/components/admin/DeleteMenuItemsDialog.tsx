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

const DeleteMenuItemsDialog = ({isPending , item} : {isPending: boolean , item:IMenuItem}) => {
   const router = useRouter()


   const handleMenuDelete = async() =>{
      try {
        await deleteMenuItem(item._id as string);
        toast.success('Item delete successfully')
        router.refresh()
      } catch (error) {
        console.error("Failed to delete menu item:", error);
      }
   }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          }
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive cursor-pointer">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this menu item from your database. 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" className='cursor-pointer' onClick={handleMenuDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteMenuItemsDialog;
