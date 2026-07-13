import type { PropertyCardProps } from "@/app/dashboard/dashboard/property-card";

export type PartnerListCard = { slug: string; avatarSrc: string; name: string; category: string; serviceType: string; linkedTo: string; created: string; status: string };
export type PartnerLinkedProperty = { rentalSlug: string; imageLayers: string[]; card?: PropertyCardProps };
export type PartnerDetailRecord = { id?: string; slug: string; name: string; category: string; serviceType: string; linkedTo: string; created: string; status: string; headerAvatarSrc: string; description: string; linkedProperties: PartnerLinkedProperty[] };

export function getPartnerPropertyCardProps(link: PartnerLinkedProperty): PropertyCardProps & { href: string } {
  return {
    ...(link.card ?? { imageLayers: link.imageLayers, badge: "funded", rightColumn: "apr" }),
    imageLayers: link.imageLayers,
    href: `/dashboard/rental/${link.rentalSlug}`,
  };
}
