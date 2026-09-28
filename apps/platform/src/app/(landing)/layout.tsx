/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Briefcase,
  Mail,
  ChevronRight,
  LogOut,
  Delete,
} from "lucide-react";
import {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
  Sidebar,
} from "../../components/ui/sidebar";
import { useUserStore } from "../../lib/store/user-store";
import { authClient } from "../../lib/clients/auth-client";
import { toast } from "sonner";
import { ModeToggle } from "../../components/mode-toggle";
import { LoadingButton } from "../../components/ui/loading-button";
import { useCallback, useState } from "react";
import { honoClient } from "../../lib/clients/hono-client";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
  },
  {
    title: "Candidatures",
    url: "/job-application",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    title: "Relances",
    url: "/relances",
    icon: Mail,
    color: "text-green-600",
  },
  {
    title: "Profil",
    url: "/profil",
    icon: Settings,
    color: "text-gray-600",
  },
];

function SidebarMobileOverlay() {
  const { open, setOpen } = useSidebar();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
      onClick={() => setOpen(false)}
    />
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setValue);
  const user = useUserStore((state) => state.value.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    authClient.signOut().then(() => {
      router.push("/");
      setUser({ isInitialized: true, user: null });
      setIsLoading(false);
      toast.success("Déconnexion utilisateur");
    });
  }, [router, setUser]);

  const handleDeleteAccount = useCallback(async () => {
    setIsLoading(true);
    honoClient.api.user["delete-account"].$delete().then(() => {
      router.push("/");
      setUser({ isInitialized: true, user: null });
      setIsLoading(false);
      toast.success("Compte supprimé");
    });
  }, [router, setUser]);

  if (!user) return;

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Sidebar Desktop & Mobile */}
        <Sidebar className="fixed z-50 md:static md:flex border-r border-slate-200/50 dark:border-slate-700 backdrop-blur-xl bg-background/95 transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-700 p-4">
              <div className="flex flex-row">
                <div className="flex items-center gap-3 mr-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                      Jobi
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Suivi de candidatures
                    </p>
                  </div>
                </div>
                <div className="flex flex-1">
                  <ModeToggle />
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-3 flex-1 overflow-auto">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                              isActive
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 text-blue-700 dark:text-white shadow-sm"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Link
                              href={item.url}
                              className="flex items-center gap-3 px-4 py-3"
                            >
                              <item.icon
                                className={`w-5 h-5 transition-colors ${
                                  isActive
                                    ? item.color
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                }`}
                              />
                              <span className="font-medium text-sm">
                                {item.title}
                              </span>
                              {isActive && (
                                <ChevronRight className="w-4 h-4 ml-auto text-blue-500" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200/50 dark:border-slate-700 p-4">
              <Popover>
      <PopoverTrigger asChild >
        <div id="user-profile" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <img
              src={
                user?.image !== "" && user?.image !== null
                  ? user?.image
                  : "/default-user.svg"
              }
              alt="Photo de profil"
              className="w-11 h-11 rounded-full object-cover border shadow"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {`${user.firstName} ${user?.lastName}`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Recherche d&apos;emploi
            </p>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-60 mt-2">
        <div className="flex flex-col gap-2 items-start">
          <LoadingButton
            variant="ghost"
            isLoading={isLoading}
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 w-full text-foreground hover:bg-muted-foreground hover:text-destructive"
          >
            <Delete className="h-4 w-4" />
            Supprimer mon compte
          </LoadingButton>

          <LoadingButton
            variant="ghost"
            isLoading={isLoading}
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-foreground hover:bg-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </LoadingButton>
        </div>
      </PopoverContent>
    </Popover>
            </SidebarFooter>
          </div>
        </Sidebar>

        {/* Overlay for mobile when sidebar is open */}
        <SidebarMobileOverlay />

        {/* Main content */}
        <main className="bg-background flex-1 flex flex-col min-h-screen">
          {/* Header mobile */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700 px-6 py-4 md:hidden z-50 flex items-center gap-4">
            <SidebarTrigger 
            id="sidebar-trigger"
            className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Jobi
            </h1>
          </header>

          <div className="flex-1 overflow-auto w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
