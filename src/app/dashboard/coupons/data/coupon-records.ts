export type CouponTab = "available" | "used" | "expired";
export type CouponRecord = { id?: string; code: string; dateCreated: string; expires: string; status?: CouponTab; discountType?: "percent" | "fixed"; discountValue?: number; asset?: string };
