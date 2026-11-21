// src/components/FeaturesItems.tsx  (তোমার আগের ফাইল)
import { getMenuItems } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";
import FeaturedPizzas from "@/components/FeaturedPizzas";

const FeaturesItems = async () => {
  const menuItems: IMenuItem[] = await getMenuItems();
  const visibleItems = menuItems
    .filter((item) => item.status === "approved" && item.active === true)
    .slice(0, 6);

  if (visibleItems.length === 0) return null;

  return <FeaturedPizzas items={visibleItems} />;
};

export default FeaturesItems;
