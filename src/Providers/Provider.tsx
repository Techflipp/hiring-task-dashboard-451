import { SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryProvider from "./LenisProvider";
import LenisProvider from "./ReactQueryProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <SidebarProvider>
        <LenisProvider>{children}</LenisProvider>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
