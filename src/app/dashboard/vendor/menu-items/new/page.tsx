import NewMenuItemForm from "@/components/vendor/NewMenuItemForm";
import { getMenuItemsByEmail } from "@/lib/api/menuItems";
import { auth } from "@/lib/auth";
import { IMenuItem } from "@/types/menuItem.type";
import { TSessionUser } from "@/types/user.type";
import { headers } from "next/headers";

const NewMenuItemPage = async () => {
  const session = await auth.api.getSession({headers : await headers()})
  if (!session?.user) return null
  const user = {
    ...session.user,
    image: session.user.image ?? "",
  } as TSessionUser
  const menuItems : IMenuItem[] = await getMenuItemsByEmail(user?.email as string)
  const activeItems = menuItems.filter(item => item.active === true)
  const menuCount = activeItems.length
  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Add Menu Item
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Create a new pizza listing. Items are reviewed by an admin before they
          appear on the menu.
        </p>
      </div>

      <NewMenuItemForm menuCount = {menuCount} isPremium={user.isPremium}/>
    </div>
  );
};

export default NewMenuItemPage;
