'use client'
import { IOrder } from '@/types/order.type';
import { cn } from 'cn';
import { XCircle } from 'lucide-react';
import React from 'react';
import { buttonVariants } from '../ui/button';
import { cancelOrder } from '@/lib/actions/orders';
import { useRouter } from 'next/navigation';
import { Trash2Icon } from "lucide-react";
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


const CancelOrderBtn = ({order}: {order:IOrder}) => {
   const router = useRouter()

   const handleCancelOrder = async () => {

      await cancelOrder(order.itemId)
      router.refresh()

   }



   return (
     <>
       <AlertDialog>
         <AlertDialogTrigger
           render={
             <button
               type="button"
               className={cn(
                 buttonVariants({ variant: "destructive", size: "sm" }),
                 "cursor-pointer",
               )}
             >
               <XCircle aria-hidden="true" />
               Cancel order
             </button>
           }
         />
         <AlertDialogContent size="sm">
           <AlertDialogHeader>
             <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
               <Trash2Icon />
             </AlertDialogMedia>
             <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
             <AlertDialogDescription>
               This will cancel your order.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel variant="outline" className='cursor-pointer'>Cancel</AlertDialogCancel>
             <AlertDialogAction
               variant="destructive"
               className='cursor-pointer'
               onClick={handleCancelOrder}
             >
               Confirm 
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </>
   );
};

export default CancelOrderBtn;