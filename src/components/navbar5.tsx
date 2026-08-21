/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MenuIcon, Moon, Sun, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/libs/utils";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { useCart } from "@/src/features/cart/useCart";
import { authService, type User } from "@/src/services/auth.service";
import { useTheme } from "@/src/providers/ThemeProvider";

interface Navbar5Props {
  className?: string;
}

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme((resolvedTheme ?? "light") === "dark" ? "light" : "dark")
      }
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-full hover:bg-primary/10"
    >
      {!mounted ? (
        <span className="h-4 w-4" aria-hidden="true" />
      ) : resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

function UserInfo({ user }: { user: User }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm">
      <p className="font-semibold text-foreground">{user.name}</p>
      <p className="text-muted-foreground">{user.email}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
        {user.role}
      </p>
    </div>
  );
}

const Navbar5 = ({ className }: Navbar5Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useMe();

  const { data: cart } = useCart();
  const totalItems =
    cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ||
    0;

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      queryClient.setQueryData(["me"], null);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/login");
    },
  });

  return (
    <section
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Bazaari
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/shoP/products"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5"
                  )}
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#categories"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5"
                  )}
                >
                  Categories
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink href="/about/company" className="rounded-md p-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary">
                        About Company
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="/about/awards" className="rounded-md p-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary">
                        Award & Achievement
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="/about/mission-vision" className="rounded-md p-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary">
                        Our Mission & Vision
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="/about/message" className="rounded-md p-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary">
                        Message of Managing Director
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="/about/success-story" className="rounded-md p-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary">
                        Success Story
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/seller/apply"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5"
                  )}
                >
                  Seller Application
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* dynamic routes based on role */}
              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={
                      user.role === "ADMIN"
                        ? "/dashboard/admin"
                        : user.role === "SELLER"
                          ? "/seller"
                          : "/orders"
                    }
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-primary transition-colors hover:bg-primary/5"
                    )}
                  >
                    {user.role === "ADMIN" && "Admin Panel"}
                    {user.role === "SELLER" && "Seller Dashboard"}
                    {user.role === "USER" && "My Orders"}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Controls (Desktop) */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-primary/10 transition-colors">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <ModeToggle />

            {isLoading ? null : user ? (
              <div className="flex items-center gap-3">
                <UserInfo user={user} />
                <Button
                  variant="destructive"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="hover:bg-primary/5 hover:text-primary">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="shadow-sm hover:shadow-md transition-all">
                  <Link href="/register">Start for free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Sheet Wrapper */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-primary/10"
            >
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto bg-background/95 backdrop-blur-xl">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                        <Store className="h-5 w-5" />
                      </div>
                      <span className="text-xl font-bold tracking-tight">
                        Bazaari
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4">
                  <div className="flex flex-col gap-1 my-3">
                    <Link href="/shoP/products" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Products
                    </Link>
                    <Link href="/#categories" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Categories
                    </Link>
                    <Link href="/about/company" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      About Company
                    </Link>
                    <Link href="/about/awards" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Award & Achievement
                    </Link>
                    <Link href="/about/mission-vision" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Our Mission & Vision
                    </Link>
                    <Link href="/about/message" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Message of Managing Director
                    </Link>
                    <Link href="/about/success-story" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Success Story
                    </Link>
                    <Link href="/seller/apply" className="font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                      Seller Application
                    </Link>

                    {/* dynamic routes based on role mobile */}
                    {user && (
                      <Link
                        href={
                          user.role === "ADMIN"
                            ? "/dashboard/admin"
                            : user.role === "SELLER"
                              ? "/seller"
                              : "/orders"
                        }
                        className="font-semibold text-primary py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        {user.role === "ADMIN" && "Admin Panel "}
                        {user.role === "SELLER" && "Seller Dashboard "}
                        {user.role === "USER" && "My Orders "}
                      </Link>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    {isLoading ? null : user ? (
                      <>
                        <UserInfo user={user} />
                        <Button
                          variant="destructive"
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                          className="shadow-sm"
                        >
                          {logoutMutation.isPending
                            ? "Signing out..."
                            : "Sign out"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                          <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild className="shadow-sm hover:shadow-md transition-all">
                          <Link href="/register">Start for free</Link>
                        </Button>
                      </>
                    )}
                    <div className="flex justify-start pt-2">
                      <ModeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </section>
  );
};

export { Navbar5 };
