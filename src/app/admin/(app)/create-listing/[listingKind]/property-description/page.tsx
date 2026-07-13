import { notFound } from "next/navigation";

import { CreateListingWizardShell } from "@/app/admin/(app)/create-listing/create-listing-wizard-shell";
import { assertRentalListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-guards";
import { isListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-data";
import { PropertyDescriptionForm } from "@/app/admin/(app)/create-listing/property-description/property-description-form";

type PageProps = {
  params: Promise<{ listingKind: string }>;
};

export default async function PropertyDescriptionWizardPage({
  params,
}: PageProps) {
  const { listingKind: raw } = await params;
  if (!isListingKind(raw)) notFound();
  assertRentalListingKind(raw);

  return (
    <CreateListingWizardShell
      activeSegment="property-description"
      listingKind={raw}
    >
      <PropertyDescriptionForm listingKind={raw} />
    </CreateListingWizardShell>
  );
}
