import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function DashboardRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;

  switch (role) {
    case "vendor":
      redirect("/dashboard/vendor");

    case "customer":
      redirect("/dashboard/customer");

    default:
      redirect("/");
  }
}
