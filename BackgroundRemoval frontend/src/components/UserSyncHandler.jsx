import { useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserSyncHandler = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const saveUser = async () => {
      if (!isLoaded || !isSignedIn || synced || !user) return;

      if (!user.firstName || !user.lastName) return;

      try {
        const token = await getToken();
        if (!token) return;

        const userData = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        await axios.post(`${backendUrl}/users`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSynced(true);
      } catch (err) {
        console.error("User sync failed", err);
        toast.error("User sync failed");
      }
    };

    saveUser();
  }, [isLoaded, isSignedIn, user, synced, backendUrl, getToken]);

  return null;
};

export default UserSyncHandler;
