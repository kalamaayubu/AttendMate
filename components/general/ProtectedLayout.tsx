import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getUserRole } from "../../utils/auth/getUserRole";

type Props = {
  allowedRoles: ("admin" | "instructor" | "student")[];
  children: React.ReactNode;
};

export function ProtectedLayout({ allowedRoles, children }: Props) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const role = await getUserRole(session.user.id);

      if (!role) {
        router.replace("/login");
        return;
      }

      if (!allowedRoles.includes(role)) {
        // Redirect unauthorized users to their home
        if (role === "admin") router.replace("/admin/home");
        else if (role === "instructor") router.replace("/instructor/home");
        else router.replace("/student/home");
        return;
      }

      setIsAuthorized(true);
    };

    checkAccess();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return <>{children}</>;
}
