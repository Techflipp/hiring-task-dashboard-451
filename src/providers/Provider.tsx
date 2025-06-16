import ReactQueryProvider from "./LenisProvider";
import LenisProvider from "./ReactQueryProvider";
import { ThemeProvider } from "./ThemeProvider";

//main provider
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <LenisProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </LenisProvider>
    </ReactQueryProvider>
  );
}
