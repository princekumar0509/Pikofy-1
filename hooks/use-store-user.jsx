import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useStoreUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [isStoring, setIsStoring] = useState(false);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    async function createUser() {
      setIsStoring(true);
      try {
        const id = await storeUser();
        setUserId(id);
      } catch (error) {
        console.error("Failed to store user:", error);
      } finally {
        setIsStoring(false);
      }
    }
    
    createUser();
    return () => {
      setUserId(null);
      setIsStoring(false);
    };
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null) || isStoring,
    isAuthenticated: isAuthenticated && userId !== null && !isStoring,
  };
}