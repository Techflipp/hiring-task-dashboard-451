export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {/* Add your sidebar/navigation here if needed */}
      <main>{children}</main>
    </div>
  );
}
