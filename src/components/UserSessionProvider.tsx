"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import supabase from "@/lib/supabaseClient";

export default function UserSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };

    if (!user) {
      init();
    }

    // auto-update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [user, setUser]);

  return <>{children}</>;
}
