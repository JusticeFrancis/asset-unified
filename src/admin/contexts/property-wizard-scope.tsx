"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { PropertyWizardPaths } from "@/admin/lib/property-wizard/paths";
import { getPropertyWizardPaths } from "@/admin/lib/property-wizard/paths";
import type { PropertyWizardScope } from "@/admin/lib/property-wizard/paths";

const PropertyWizardScopeContext = createContext<PropertyWizardPaths | null>(
  null,
);

export function PropertyWizardScopeProvider({
  scope,
  children,
}: {
  scope: PropertyWizardScope;
  children: ReactNode;
}) {
  const paths = getPropertyWizardPaths(scope);
  return (
    <PropertyWizardScopeContext.Provider value={paths}>
      {children}
    </PropertyWizardScopeContext.Provider>
  );
}

export function usePropertyWizardPaths() {
  const context = useContext(PropertyWizardScopeContext);
  if (!context) {
    throw new Error(
      "usePropertyWizardPaths must be used within PropertyWizardScopeProvider",
    );
  }
  return context;
}
