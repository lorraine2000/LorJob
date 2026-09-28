"use client";

import { APIAuthError } from "packages/enums/errors/api-errors";
import { useEffect } from "react";
import { toast } from "sonner";
import { honoClient } from "../../lib/clients/hono-client";
import { useUserStore } from "../../lib/store/user-store";
import { getAPIErrorMessage, getErrorMessage } from "packages/utils/errors";

async function fetchUser() {
  const response = await honoClient.api.user.platform.session.$get();
  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }
  return response.json();
}

export function UserProvider() {
  const setUser = useUserStore((state) => state.setValue);
  useEffect(() => {
    setUser({ isInitialized: false, user: null });
    fetchUser()
      .then((user) => {
        console.log("UserProvider", { user });
        setUser({ isInitialized: true, user });
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        if (message !== APIAuthError.UNAUTHORIZED)
          toast.error(getAPIErrorMessage(error));
        setUser({ isInitialized: true, user: null });
      });
  }, [setUser]);

  return null;
}
