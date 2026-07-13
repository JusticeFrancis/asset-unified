import { notFound } from "next/navigation";

import { CreateListingWizardShell } from "@/app/admin/(app)/create-listing/create-listing-wizard-shell";
import { assertRentalListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-guards";
import { isListingKind } from "@/app/admin/(app)/create-listing/create-listing-wizard-data";
import { LegalOwnershipForm } from "@/app/admin/(app)/create-listing/legal-ownership/legal-ownership-form";

type PageProps = {
  params: Promise<{ listingKind: string }>;
};

export default async function LegalOwnershipPage({ params }: PageProps) {
  const { listingKind: raw } = await params;
  if (!isListingKind(raw)) notFound();
  assertRentalListingKind(raw);

  return (
    <CreateListingWizardShell activeSegment="legal-ownership" listingKind={raw}>
      <LegalOwnershipForm listingKind={raw} />
    </CreateListingWizardShell>
  );
}
