import MenuItemsManager from "@/components/admin/MenuItemsManager";
import { getMenuItems } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";

/* ---------- Page ---------- */

const ManageMenuItemsPage = async () => {
  const menuItems = (await getMenuItems()) as IMenuItem[];
  const items = Array.isArray(menuItems) ? menuItems : [];

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          View, search, and filter every submission. Review pending items, then
          approve or reject them — and change the status of published items or
          delete inappropriate ones.
        </p>
      </div>

      {/* Search, filters, and table */}
      <MenuItemsManager menuItems={items} />
    </div>
  );
};

export default ManageMenuItemsPage;
