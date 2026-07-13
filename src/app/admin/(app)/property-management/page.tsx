"use client";

import { PropertyManagementPageContent } from "@/app/admin/components/property-management-page-content";
import { PropertyWizardScopeProvider } from "@/admin/contexts/property-wizard-scope";

export default function PropertyManagementPage() {
  return (
    <PropertyWizardScopeProvider scope="admin">
      <PropertyManagementPageContent />
    </PropertyWizardScopeProvider>
  );
}
