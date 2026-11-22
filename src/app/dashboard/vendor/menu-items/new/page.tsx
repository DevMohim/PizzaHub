import { redirect } from "next/navigation";
import NewMenuItemForm from "@/components/vendor/NewMenuItemForm";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
import { getMenuItemsByEmail } from "@/lib/api/menuItems";
import type { IMenuItem } from "@/types/menuItem.type";

const NewMenuItemPage = async () => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  // Premium status এখন DB থেকে আসে, তাই profile fetch করা হচ্ছে
  const profile = await getMyProfile(token);

  if (profile.role !== "vendor") {
    redirect("/");
  }

  let menuItems: IMenuItem[] = [];

  try {
    menuItems = await getMenuItemsByEmail(token);
  } catch (error) {
    console.error("[vendor/menu-items/new] load failed:", error);
  }

  // Free plan এর limit active item গণনা করে
  const activeCount = menuItems.filter((item) => item.active === true).length;
  const isPremium =
    profile.subscriptionPlan === "premium" &&
    Boolean(profile.subscriptionExpiresAt) &&
    new Date(profile.subscriptionExpiresAt as string) > new Date();

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

      <NewMenuItemForm menuCount={activeCount} isPremium={isPremium} />
    </div>
  );
};

export default NewMenuItemPage;
