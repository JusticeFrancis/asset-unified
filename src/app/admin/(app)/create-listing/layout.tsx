import { CreateListingWizardProvider } from "@/app/admin/(app)/create-listing/create-listing-wizard-provider";
import { PropertyWizardScopeProvider } from "@/admin/contexts/property-wizard-scope";

type CreateListingLayoutProps = {
  children: React.ReactNode;
};

export default function CreateListingLayout({
  children,
}: CreateListingLayoutProps) {
  return (
    <PropertyWizardScopeProvider scope="admin">
      <CreateListingWizardProvider>{children}</CreateListingWizardProvider>
    </PropertyWizardScopeProvider>
  );
}
