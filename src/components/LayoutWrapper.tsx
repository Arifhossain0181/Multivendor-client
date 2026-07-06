"use client";

import { usePathname } from "next/navigation";
import { Navbar5 } from "./navbar5";
import { Footer7 } from "./footer7";


const NO_LAYOUT_ROUTES = ["/dashboard", "/admin", "/seller", "/customers"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/seller" ||
    NO_LAYOUT_ROUTES.filter((route) => route !== "/seller").some((route) =>
      pathname.startsWith(route),
    );

  return (
    <>
      {!hideLayout && <Navbar5 />}
      <main className={hideLayout ? "" : "min-h-screen"}>
        {children}
      </main>
      {!hideLayout && <Footer7 />}
    </>
  );
}
