import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
   
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}