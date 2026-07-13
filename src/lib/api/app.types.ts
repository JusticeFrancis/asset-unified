export type ApiRecord = {
  id: string;
  resource: string;
  slug: string;
  title?: string;
  status?: string;
  published?: boolean;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type RecordsResponse<T extends ApiRecord = ApiRecord> = {
  records: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type DashboardOverview = {
  wallet: { asset: string; balance: number; status: string };
  rental: {
    rentBalance: number;
    accountValue: number;
    propertiesOwned: number;
    totalRentClaimed: number;
    totalPropertyValue: number;
    properties: Array<{ slug: string; shares: number; amount: number; status: string }>;
  };
  construction: {
    claimable: number;
    overallClaimed: number;
    sharesOnSale: number;
    sharesSold: number;
    properties: ApiRecord[];
  };
};

export type WalletDepositMethod = {
  id: string;
  label: string;
  subLabel?: string;
  network?: string;
  asset?: string;
  recommended?: boolean;
  chainCorner?: "polygon" | "tron" | null;
};

export type WalletFiatCurrency = {
  code: string;
  name: string;
  flag?: string;
};

export type WalletTransferOption = {
  id: string;
  label: string;
  currency?: string;
  minimum?: number;
  feeLabel?: string;
  eta?: string;
  url?: string;
  accountDetails?: Record<string, unknown>;
};

export type WalletDepositInstructions = {
  methods?: WalletDepositMethod[];
  fiatCurrencies?: WalletFiatCurrency[];
  transferOptions?: WalletTransferOption[];
  polygonUsdt?: {
    address?: string | null;
    asset?: string;
    network?: string;
    networkLabel?: string;
    tokenContract?: string | null;
  };
  networkFee?: number;
  networkFeeAsset?: string;
  [key: string]: unknown;
};

export type WalletData = {
  id: string;
  provider: string;
  status: string;
  address: string | null;
  balances: Record<string, number>;
  depositInstructions: WalletDepositInstructions;
  transactions: Array<{
    id: string;
    kind: string;
    direction: "credit" | "debit";
    asset: string;
    amount: number;
    status: string;
    description: string;
    providerId?: string | null;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }>;
};
