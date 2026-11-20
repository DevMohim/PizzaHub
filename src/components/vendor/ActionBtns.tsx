'use client'
import { Button } from '../ui/button';
import { CookingPot, XCircle } from 'lucide-react';
import { IOrder } from '@/types/order.type';
import { updateApproveOrder, updateRejectOrder } from '@/lib/actions/orders';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ActionBtns = ({order} : {order:IOrder}) => {
   const router = useRouter()
   console.log('item id', order?.itemId)

   const handleOrderApproved = async() => {
      try {
         console.log("item id", order?.itemId);
        await updateApproveOrder(order.itemId);
        toast.success("Order approved");
        router.refresh();
      } catch (error) {
        console.error("Failed to approve order:", error);
        toast.error("Failed to approve order");
      }
   }
   const handleOrderReject = async () => {
     try {
       await updateRejectOrder(order.itemId);
       toast.success("Order rejected");
       router.refresh();
     } catch (error) {
       console.error("Failed to reject order:", error);
       toast.error("Failed to reject order");
     }
   };
   return (
     <>
       <div className="flex items-center gap-2">
         {order.status !== "approved" && (
           <Button
             type="button"
             variant="destructive"
             size="sm"
             className="cursor-pointer"
             onClick={handleOrderReject}
             disabled ={order.status === 'rejected'}
           >
             <XCircle aria-hidden="true" />
             Reject
           </Button>
         )}
         {order.status !== "rejected" && (
           <Button
             type="button"
             size="sm"
             className="cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
             onClick={handleOrderApproved}
             disabled = {order.status === 'approved'}
           >
             <CookingPot aria-hidden="true" />
             Approve
           </Button>
         )}
       </div>
     </>
   );
};

export default ActionBtns;