import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import MenuItemsManager from "@/components/admin/MenuItemsManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
import { getAdminMenuItems, getAdminVendors } from "@/lib/api/menuItems";
import type { IMenuItem } from "@/types/menuItem.type";

type SearchParams = Promise<{
  search?: string;
  status?: string;
  category?: string;
  vendor?: string;
  sort?: string;
  page?: string;
}>;

const ManageMenuItemsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "admin") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;

  let items: IMenuItem[] = [];
  let total = 0;
  let vendors: { value: string; label: string }[] = [];
  let errorMessage: string | null = null;

  try {
    const [itemsRes, vendorsRes] = await Promise.all([
      getAdminMenuItems(
        {
          search: params.search,
          status: params.status,
          category: params.category,
          vendor: params.vendor,
          sort: params.sort,
          page: String(page),
          limit: "20",
        },
        token,
      ),
      getAdminVendors(token),
    ]);

    items = itemsRes.items ?? [];
    total = itemsRes.total ?? 0;
    vendors = Array.isArray(vendorsRes) ? vendorsRes : [];
  } catch (error) {
    console.error("[admin/menu-items] load failed:", error);
    errorMessage = "Menu items load করা যায়নি। Terminal এ error দেখুন।";
  }

  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          View, search, and filter every submission. Review pending items, then
          approve or reject them, change the status of published items, or
          delete inappropriate ones.
        </p>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Couldn&apos;t load menu items</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : (
        <MenuItemsManager
          items={items}
          total={total}
          page={page}
          limit={20}
          vendors={vendors}
          initialFilters={{
            search: params.search ?? "",
            status: params.status ?? "all",
            category: params.category ?? "all",
            vendor: params.vendor ?? "all",
            sort: params.sort ?? "newest",
          }}
        />
      )}
    </div>
  );
};

export default ManageMenuItemsPage;
