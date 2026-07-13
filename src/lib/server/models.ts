import mongoose, { type Model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  fullName: { type: String, default: null },
  country: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  avatarUrl: { type: String, default: null },
  referralCode: { type: String, unique: true, sparse: true, index: true },
  referredBy: { type: ObjectId, ref: "AssetUnionUser", default: null },
  status: { type: String, enum: ["active", "suspended", "pending", "deleted"], default: "active", index: true },
  kycStatus: { type: String, default: "not_started" },
  accountType: { type: String, enum: ["investor", "tenant", "property_owner"], default: "investor" },
  walletStatus: { type: String, default: "not_connected" },
  twoFactorEnabled: { type: Boolean, default: false },
  acceptedTermsAt: Date,
  emailVerifiedAt: Date,
  profileCompletedAt: Date,
  lastLoginAt: Date,
  deletedAt: Date,
  metadata: { type: Mixed, default: {} },
}, { timestamps: true });

const OtpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 },
  usedAt: Date,
}, { timestamps: true });

const RefreshTokenSchema = new Schema({
  userId: { type: ObjectId, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: Date,
  userAgent: String,
  ipAddress: String,
  locationLabel: String,
  browserLabel: String,
  lastUsedAt: Date,
}, { timestamps: true });

/**
 * Published product/content records. The payload is intentionally flexible so
 * the existing high-fidelity UI can evolve without a destructive migration.
 * API validation still enforces resource-specific required fields.
 */
const AppRecordSchema = new Schema({
  resource: { type: String, required: true, index: true },
  slug: { type: String, required: true, trim: true },
  title: { type: String, default: "" },
  status: { type: String, default: "draft", index: true },
  published: { type: Boolean, default: false, index: true },
  featured: { type: Boolean, default: false, index: true },
  sortOrder: { type: Number, default: 0, index: true },
  ownerId: { type: ObjectId, ref: "AssetUnionUser", default: null, index: true },
  data: { type: Mixed, required: true, default: {} },
}, { timestamps: true, minimize: false });
AppRecordSchema.index({ resource: 1, slug: 1 }, { unique: true });
AppRecordSchema.index({ resource: 1, published: 1, sortOrder: 1, createdAt: -1 });

const WalletSchema = new Schema({
  userId: { type: ObjectId, required: true, unique: true, index: true },
  provider: { type: String, default: "bridge" },
  providerCustomerId: String,
  providerWalletId: String,
  address: String,
  status: { type: String, default: "not_connected" },
  balances: { type: Mixed, default: {} },
  depositInstructions: { type: Mixed, default: {} },
}, { timestamps: true, minimize: false });

const WalletTransactionSchema = new Schema({
  userId: { type: ObjectId, required: true, index: true },
  propertyId: { type: ObjectId, ref: "AssetUnionRecord", default: null, index: true },
  kind: { type: String, required: true, index: true },
  direction: { type: String, enum: ["credit", "debit"], required: true },
  asset: { type: String, default: "USDT" },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, default: "pending", index: true },
  provider: String,
  providerId: String,
  description: String,
  metadata: { type: Mixed, default: {} },
  completedAt: Date,
}, { timestamps: true, minimize: false });
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });

const InvestmentSchema = new Schema({
  userId: { type: ObjectId, required: true, index: true },
  propertyId: { type: ObjectId, ref: "AssetUnionRecord", required: true, index: true },
  propertySlug: { type: String, required: true, index: true },
  propertyKind: { type: String, required: true, index: true },
  shares: { type: Number, required: true, min: 1 },
  sharePrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  asset: { type: String, default: "USDT" },
  status: { type: String, default: "pending", index: true },
  providerTransferId: String,
  metadata: { type: Mixed, default: {} },
}, { timestamps: true, minimize: false });
InvestmentSchema.index({ userId: 1, propertyId: 1, createdAt: -1 });

const CouponSchema = new Schema({
  code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
  status: { type: String, default: "active", index: true },
  discountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
  discountValue: { type: Number, required: true, min: 0 },
  asset: { type: String, default: "USD" },
  startsAt: Date,
  expiresAt: Date,
  usageLimit: Number,
  usageCount: { type: Number, default: 0 },
  userIds: [{ type: ObjectId, ref: "AssetUnionUser" }],
  metadata: { type: Mixed, default: {} },
}, { timestamps: true, minimize: false });

const CouponRedemptionSchema = new Schema({
  couponId: { type: ObjectId, ref: "AssetUnionCoupon", required: true, index: true },
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  status: { type: String, enum: ["available", "used", "expired"], default: "available", index: true },
  usedAt: Date,
}, { timestamps: true });
CouponRedemptionSchema.index({ couponId: 1, userId: 1 }, { unique: true });

const NotificationSchema = new Schema({
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  type: { type: String, default: "general", index: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  href: String,
  metadata: { type: Mixed, default: {} },
  readAt: Date,
}, { timestamps: true, minimize: false });
NotificationSchema.index({ userId: 1, createdAt: -1 });

const ReferralSchema = new Schema({
  referrerId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  referredUserId: { type: ObjectId, ref: "AssetUnionUser", default: null, index: true },
  email: { type: String, lowercase: true, trim: true },
  status: { type: String, enum: ["invited", "registered", "qualified", "rewarded"], default: "invited", index: true },
  rewardAmount: { type: Number, default: 0 },
  rewardAsset: { type: String, default: "USDT" },
  points: { type: Number, default: 0 },
  qualifiedAt: Date,
  rewardedAt: Date,
}, { timestamps: true });
ReferralSchema.index({ referrerId: 1, createdAt: -1 });

const GovernanceVoteSchema = new Schema({
  proposalId: { type: ObjectId, ref: "AssetUnionRecord", required: true, index: true },
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  choice: { type: String, enum: ["for", "against", "abstain"], required: true },
  weight: { type: Number, required: true, min: 0 },
}, { timestamps: true });
GovernanceVoteSchema.index({ proposalId: 1, userId: 1 }, { unique: true });

const SupportMessageSchema = new Schema({
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  sender: { type: String, enum: ["user", "support"], required: true },
  body: { type: String, required: true, trim: true },
  readAt: Date,
}, { timestamps: true });
SupportMessageSchema.index({ userId: 1, createdAt: 1 });

const P2POrderSchema = new Schema({
  offerId: { type: ObjectId, ref: "AssetUnionRecord", required: true, index: true },
  buyerId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  sellerId: { type: ObjectId, ref: "AssetUnionUser", required: true, index: true },
  asset: { type: String, required: true },
  fiatCurrency: { type: String, required: true },
  assetAmount: { type: Number, required: true, min: 0 },
  fiatAmount: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  side: { type: String, enum: ["buy", "sell"], required: true },
  status: { type: String, default: "pending", index: true },
  metadata: { type: Mixed, default: {} },
}, { timestamps: true, minimize: false });

const AcademyProfileSchema = new Schema({
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, unique: true, index: true },
  totalPoints: { type: Number, default: 0 },
  questPoints: { type: Number, default: 0 },
  farmingPoints: { type: Number, default: 0 },
  referralPoints: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  completedQuestSlugs: { type: [String], default: [] },
}, { timestamps: true });

const VaultSchema = new Schema({
  userId: { type: ObjectId, ref: "AssetUnionUser", required: true, unique: true, index: true },
  encryptedPrivateKey: String,
  iv: String,
  authTag: String,
}, { timestamps: true });

function model(name: string, schema: Schema): Model<any> {
  return (mongoose.models[name] as Model<any> | undefined) ?? mongoose.model<any>(name, schema);
}

export const UserModel: any = model("AssetUnionUser", UserSchema);
export const OtpModel: any = model("AssetUnionOtp", OtpSchema);
export const RefreshTokenModel: any = model("AssetUnionRefreshToken", RefreshTokenSchema);
export const AppRecordModel: any = model("AssetUnionRecord", AppRecordSchema);
export const WalletModel: any = model("AssetUnionWallet", WalletSchema);
export const WalletTransactionModel: any = model("AssetUnionWalletTransaction", WalletTransactionSchema);
export const InvestmentModel: any = model("AssetUnionInvestment", InvestmentSchema);
export const CouponModel: any = model("AssetUnionCoupon", CouponSchema);
export const CouponRedemptionModel: any = model("AssetUnionCouponRedemption", CouponRedemptionSchema);
export const NotificationModel: any = model("AssetUnionNotification", NotificationSchema);
export const ReferralModel: any = model("AssetUnionReferral", ReferralSchema);
export const GovernanceVoteModel: any = model("AssetUnionGovernanceVote", GovernanceVoteSchema);
export const SupportMessageModel: any = model("AssetUnionSupportMessage", SupportMessageSchema);
export const P2POrderModel: any = model("AssetUnionP2POrder", P2POrderSchema);
export const AcademyProfileModel: any = model("AssetUnionAcademyProfile", AcademyProfileSchema);
export const VaultModel: any = model("AssetUnionVault", VaultSchema);
