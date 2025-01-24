"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              "font-bold text-2xl transition-colors duration-200",
              isScrolled ? "text-[#151849]" : "text-white"
            )}
          >
            PropertyFi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link href="/technology" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-white/10 focus:bg-white/10",
                        isScrolled 
                          ? "text-[#151849] hover:bg-[#151849]/5" 
                          : "text-white"
                      )}
                    >
                      Technology
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/team" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-white/10 focus:bg-white/10",
                        isScrolled 
                          ? "text-[#151849] hover:bg-[#151849]/5" 
                          : "text-white"
                      )}
                    >
                      Team
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-white/10 focus:bg-white/10",
                        isScrolled 
                          ? "text-[#151849] hover:bg-[#151849]/5" 
                          : "text-white"
                      )}
                    >
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-white/10 focus:bg-white/10",
                        isScrolled 
                          ? "text-[#151849] hover:bg-[#151849]/5" 
                          : "text-white"
                      )}
                    >
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "ml-2 hover:bg-white/10",
                isScrolled 
                  ? "text-[#151849] hover:bg-[#151849]/5" 
                  : "text-white"
              )}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "hover:bg-white/10",
                  isScrolled 
                    ? "text-[#151849] hover:bg-[#151849]/5" 
                    : "text-white"
                )}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-6 mt-8">
                <Link 
                  href="/technology" 
                  className="text-lg font-medium text-[#151849] hover:text-[#151849]/80 transition-colors"
                >
                  Technology
                </Link>
                <Link 
                  href="/team" 
                  className="text-lg font-medium text-[#151849] hover:text-[#151849]/80 transition-colors"
                >
                  Team
                </Link>
                <Link 
                  href="/about" 
                  className="text-lg font-medium text-[#151849] hover:text-[#151849]/80 transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-lg font-medium text-[#151849] hover:text-[#151849]/80 transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}