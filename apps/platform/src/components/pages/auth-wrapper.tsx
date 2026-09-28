import { usePathname, useRouter } from "next/navigation";
import { PlatformUserData } from "packages/api-types";
import { type ComponentType, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useUserStore } from "../../lib/store/user-store";
import { Loader2 } from "lucide-react";

type AuthWrapperProps = {
  Page: ComponentType<{ user: PlatformUserData }>;
};

export function AuthWrapper({ Page }: AuthWrapperProps) {
  const router = useRouter();
  const userData = useUserStore((state) => state.value);
  const path = usePathname();

  useEffect(() => {
    if (userData.isInitialized && (!userData.user || !userData.user)) {
      toast.error(
        "Vous devez être connecté pour accéder à votre tableau de bord."
      );
      router.push("/sign-in");
    }else if (userData.isInitialized && userData.user && userData.user.emailVerified && path === "/") {
		router.push("/dashboard");
	}
  }, [router, userData.isInitialized, userData.user, path]); 

  const user = useMemo(() => {
    if (!userData.isInitialized || !userData.user || !userData.user)
      return null;
    return userData.user;
  }, [userData.isInitialized, userData.user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="animate-pulse text-muted-foreground text-lg">
          Chargement...
        </div>
      </div>
    );
  }

  return <Page user={user} />;
}
