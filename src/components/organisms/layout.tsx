export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen">
        <main className="w-full pt-16 lg:pl-72 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
