/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* eslint-disable @next/next/no-img-element */

import { MenuIcon, Moon, Sun, ShoppingCart } from "lucide-react"; // ShoppingCart
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
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

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        setTheme((resolvedTheme ?? "light") === "dark" ? "light" : "dark")
      }
      aria-label="Toggle theme"
    >
      {!resolvedTheme ? (
        <span className="h-5 w-5" aria-hidden="true" />
      ) : resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

function UserInfo({ user }: { user: User }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm">
      <p className="font-medium text-foreground">{user.name}</p>
      <p className="text-muted-foreground">{user.email}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {user.role}
      </p>
    </div>
  );
}

const Navbar5 = ({ className }: Navbar5Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useMe();

  // tanstack query use kore cart items fetch kora hocche
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

  const features = [
    {
      title: "Dashboard",
      description: "Overview of your activity",
      href: "#",
    },
    {
      title: "Analytics",
      description: "Track your performance",
      href: "#",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      href: "#",
    },
    {
      title: "Integrations",
      description: "Connect with other tools",
      href: "#",
    },
    {
      title: "Storage",
      description: "Manage your files",
      href: "#",
    },
    {
      title: "Support",
      description: "Get help when needed",
      href: "#",
    },
  ];

  return (
    <section
      className={cn(
        "py-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="max-h-8"
              alt="Logo"
            />
            <span className="text-lg font-semibold tracking-tighter">
              Bazaari
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-150 grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div>
                          <p className="mb-1 font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/shoP/products"
                  className={navigationMenuTriggerStyle()}
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/seller/apply"
                  className={navigationMenuTriggerStyle()}
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
                        ? "/admin"
                        : user.role === "SELLER"
                          ? "/seller"
                          : "/orders"
                    }
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-primary",
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
          <div className="hidden items-center gap-4 lg:flex">
            {/*  Global Cart Badge Button */}
            <Button asChild variant="outline" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
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
                >
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Start for free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Sheet Wrapper */}
          <div className="flex items-center gap-4 lg:hidden">
            {/*  Mobile view Cart Badge */}
            <Button
              asChild
              variant="outline"
              size="icon"
              className="relative mr-2"
            >
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                        className="max-h-8"
                        alt="Logo"
                      />
                      <span className="text-lg font-semibold tracking-tighter">
                        Bazaari
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4">
                  <Accordion type="single" collapsible className="mt-4 mb-2">
                    <AccordionItem value="solutions" className="border-none">
                      <AccordionTrigger className="text-base hover:no-underline">
                        Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid md:grid-cols-2">
                          {features.map((feature, index) => (
                            <a
                              href={feature.href}
                              key={index}
                              className="rounded-md p-3 transition-colors hover:bg-muted/70"
                            >
                              <div>
                                <p className="mb-1 font-semibold text-foreground">
                                  {feature.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {feature.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Mobile Links List */}
                  <div className="flex flex-col gap-6 my-2">
                    <Link href="/shoP/products" className="font-medium">
                      Products
                    </Link>
                    <Link href="/seller/apply" className="font-medium">
                      Seller Application
                    </Link>

                    {/* dynamic routes based on role mobile */}
                    {user && (
                      <Link
                        href={
                          user.role === "ADMIN"
                            ? "/admin"
                            : user.role === "SELLER"
                              ? "/seller"
                              : "/orders"
                        }
                        className="font-semibold text-primary"
                      >
                        {user.role === "ADMIN" && "Admin Panel "}
                        {user.role === "SELLER" && "Seller Dashboard "}
                        {user.role === "USER" && "My Orders "}
                      </Link>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-4">
                    {isLoading ? null : user ? (
                      <>
                        <UserInfo user={user} />
                        <Button
                          variant="destructive"
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending
                            ? "Signing out..."
                            : "Sign out"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild>
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
