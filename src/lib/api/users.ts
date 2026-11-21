const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`);

    if (!res.ok) {
      throw new Error(
        `Failed to get user. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Get users failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not get users.", { cause: error });
  }
};

export const getUserByEmail = async ( id:string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`);

    if (!res.ok) {
      throw new Error(
        `Failed to get user. Server returned ${res.status} ${res.statusText}.`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Get users failed:", error);

    // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
    throw new Error("Could not get users.", { cause: error });
  }
};