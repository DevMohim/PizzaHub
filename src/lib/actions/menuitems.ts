import { IMenuItem } from "@/types/menuItem.type";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createMenuItem = async (data :IMenuItem ) => {
  if (!data) {
    throw new Error("Menu item data is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" 
        // Authorization: `Bearer ${token}`
       },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create menu item. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Create menu item failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not create menu item.", { cause: error });
  }
};

export const updateMenuItem = async(id:string,  data:IMenuItem) => {
  if (!id) {
    throw new Error("Menu item id is required.");
  }
  if(!data){
    throw new Error("Update data is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update menu item info. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Update menu item info:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not update menu item info.", { cause: error });
  }
}

export const deleteMenuItem = async ( id:string) => {
if (!id) {
  throw new Error("Menu item id is required.");
}

try {
  const res = await fetch(`${BASE_URL}/menuItems/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to update menu item status. Server returned ${res.status} ${res.statusText}.`,
    );
  }

  return await res.json();
} catch (error) {
  console.error("Update menu item status failed:", error);

  // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
  throw new Error("Could not update menu item status.", { cause: error });
}
}


export const updateApproveStatus = async (id:string) => {
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update menu item status. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Update menu item status failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not update menu item status.", { cause: error });
}
}

export const updateRejectStatus = async (id:string) => {
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update menu item status. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Update menu item status failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not update menu item status.", { cause: error });
}
}

export const updateInactiveStatus = async(id:string) =>{
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}/inactive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update menu item status. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Update menu item status failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not update menu item status.", { cause: error });
  }
}
export const updateActiveStatus = async(id:string) =>{
  if (!id) {
    throw new Error("Menu item id is required.");
  }

  try {
    const res = await fetch(`${BASE_URL}/menuItems/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update menu item status. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Update menu item status failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not update menu item status.", { cause: error });
  }
}