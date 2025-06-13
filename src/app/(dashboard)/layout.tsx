export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F3F4F6" }}>
      <div className="w-full max-w-screen-2xl mx-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
}
