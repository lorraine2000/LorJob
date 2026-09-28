"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { cn } from "../lib/utils" // Assure-toi d'avoir cette fonction utilitaire

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "transition-all duration-300 ease-in-out",
        "hover:bg-muted hover:scale-105 active:scale-95"
      )}
    >
      {isDark ? (
        <Sun
          className="text-yellow-500 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300 ease-in-out hover:rotate-180"
        />
      ) : (
        <Moon
          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300 ease-in-out hover:rotate-180"
        />
      )}
    </Button>
  )
}
