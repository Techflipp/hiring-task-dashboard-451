import ReactQueryProvider from "./LenisProvider";
import LenisProvider from "./ReactQueryProvider";

//main provider
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <LenisProvider>{children}</LenisProvider>
    </ReactQueryProvider>
  );
}
