export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  country?: string;
  phoneNumber?: string;
  profileComplete: boolean;
  profileCompletedAt?: number;
  status: string;
  kycStatus: string;
  walletStatus?: string;
  emailVerifiedAt?: number;
  createdAt?: number;
};

export type OtpSendResponse = {
  otpSessionId: string;
  expiresAt: number;
  maskedEmail: string;
  isExistingUser: boolean;
};

export type OtpVerifyResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  isNewUser: boolean;
  profileComplete: boolean;
  user: Pick<
    AuthUser,
    | "id"
    | "email"
    | "fullName"
    | "kycStatus"
    | "walletStatus"
    | "profileComplete"
  >;
};

export type UpdateProfileRequest = {
  fullName: string;
  country: string;
  phoneNumber: string;
};
