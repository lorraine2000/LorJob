"use client";

import { CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "./ui/drawer";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // fonction appelée au clic sur le trigger, toggle drawer + état icône
  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <CardHeader className="fixed top-0 left-0 w-full z-50 px-4 py-2 bg-background shadow-md flex justify-between items-center">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between w-full items-center">
        {/* Logo */}
        <h1
          className="text-3xl font-extrabold text-primary tracking-tight cursor-pointer"
          onClick={() => router.push("/")}
        >
          Jobi Platform
        </h1>

        {/* Actions */}
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            className="bg-primary text-primary-foreground w-28 rounded-full hover:text-white hover:bg-secondary-foreground/70"
            onClick={() => router.push("/sign-in")}
          >
            Se connecter
          </Button>

          <ModeToggle />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden flex items-center justify-between w-full">
        {/* Logo */}
        <h1
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => router.push("/")}
        >
          Jobi
        </h1>

        <Drawer direction="top" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleDrawer}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="z-50 top-4  md:hidden">
              
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 ease-in-out" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300 ease-in-out" />
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent   className="bg-card/90 border-transparent mt-10 z-40 md:hidden"
>
            <div className="flex flex-1 flex-col gap-4 mt-4 bg-muted-foreground rounded-lg shadow-md p-4 w-64 ml-30">
              <Button
                variant="secondary"
                className="bg-primary text-primary-foreground w-full rounded-full"
                onClick={() => {
                  router.push("/sign-in");
                  setIsOpen(false);
                }}
              >
                Se connecter
              </Button>

              <ModeToggle />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </CardHeader>
  );
}
