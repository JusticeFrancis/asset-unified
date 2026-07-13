import { AppProviders as AdminProviders } from "@/admin/components/providers";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProviders>{children}</AdminProviders>;
}
