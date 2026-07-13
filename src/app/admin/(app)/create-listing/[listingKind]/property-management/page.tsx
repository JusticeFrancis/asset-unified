import { notFound } from "next/navigation";

import { CreateListingWizardShell } from "@/app/admin/(app)/create-listing/create-listing-wizard-shell";
import { assertRentalListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-guards";
import { isListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-data";
import { PropertyManagementForm } from "@/app/admin/(app)/create-listing/property-management/property-management-form";

type PageProps = {
  params: Promise<{ listingKind: string }>;
};

export default async function PropertyManagementWizardPage({
  params,
}: PageProps) {
  const { listingKind: raw } = await params;
  if (!isListingKind(raw)) notFound();
  assertRentalListingKind(raw);

  return (
    <CreateListingWizardShell
      activeSegment="property-management"
      listingKind={raw}
    >
      <PropertyManagementForm listingKind={raw} />
    </CreateListingWizardShell>
  );
}
