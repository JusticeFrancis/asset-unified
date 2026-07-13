const POLYGON_USDT_METHOD = {
  id: "usdt-polygon",
  label: "USDT",
  subLabel: "Polygon (MATIC)",
  network: "polygon",
  asset: "USDT",
  recommended: true,
  chainCorner: "polygon",
};

type AnyRecord = Record<string, any>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function nested(record: AnyRecord, path: string[]) {
  let current: unknown = record;
  for (const key of path) {
    if (!isRecord(current)) return null;
    current = current[key];
  }
  return current;
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function extractAddressFromTransferOptions(options: AnyRecord[]) {
  for (const option of options) {
    const details = isRecord(option.accountDetails) ? option.accountDetails : isRecord(option.account_details) ? option.account_details : {};
    const address = firstText(
      option.address,
      option.walletAddress,
      option.wallet_address,
      details.address,
      details.walletAddress,
      details.wallet_address,
      details.depositAddress,
      details.deposit_address,
    );
    const haystack = [
      option.id,
      option.label,
      option.asset,
      option.currency,
      option.network,
      details.asset,
      details.currency,
      details.network,
      details.blockchain,
    ].join(" ").toLowerCase();
    if (address && haystack.includes("usdt") && (haystack.includes("polygon") || haystack.includes("matic"))) {
      return address;
    }
  }
  return null;
}

function extractPolygonUsdtAddress(instructions: AnyRecord, fallbackAddress?: string | null) {
  const transferOptions = normalizeArray(instructions.transferOptions ?? instructions.transfer_options);
  return firstText(
    nested(instructions, ["polygonUsdt", "address"]),
    nested(instructions, ["polygonUSDT", "address"]),
    nested(instructions, ["usdtPolygon", "address"]),
    nested(instructions, ["usdt_polygon", "address"]),
    nested(instructions, ["crypto", "polygon", "address"]),
    nested(instructions, ["crypto", "matic", "address"]),
    nested(instructions, ["depositAddress", "address"]),
    instructions.polygonUsdtAddress,
    instructions.usdtPolygonAddress,
    instructions.depositAddress,
    instructions.walletAddress,
    instructions.wallet_address,
    instructions.address,
    extractAddressFromTransferOptions(transferOptions),
    fallbackAddress,
    process.env.POLYGON_USDT_DEPOSIT_ADDRESS,
    process.env.USDT_POLYGON_DEPOSIT_ADDRESS,
  );
}

function cryptoTransferOption(address: string) {
  return {
    id: "usdt-polygon-address",
    label: "USDT Polygon (MATIC)",
    currency: "USDT",
    accountDetails: {
      address,
      asset: "USDT",
      network: "Polygon (MATIC)",
    },
  };
}

function normalizeTransferOptions(instructions: AnyRecord, address: string | null) {
  const rawOptions = normalizeArray(instructions.transferOptions ?? instructions.transfer_options);
  const options: AnyRecord[] = rawOptions.map((option): AnyRecord => ({
    ...option,
    accountDetails: isRecord(option.accountDetails)
      ? option.accountDetails
      : isRecord(option.account_details)
        ? option.account_details
        : option.accountDetails,
  }));

  if (!address) return options;

  const hasPolygonAddress = options.some((option) => {
    const details = isRecord(option.accountDetails) ? option.accountDetails : {};
    const optionAddress = firstText(option.address, details.address, details.walletAddress, details.wallet_address);
    const text = [option.id, option.label, option.asset, option.currency, option.network, details.asset, details.network]
      .join(" ")
      .toLowerCase();
    return optionAddress === address && (text.includes("polygon") || text.includes("matic") || text.includes("usdt"));
  });

  return hasPolygonAddress ? options : [cryptoTransferOption(address), ...options];
}

export function serializeWalletDepositInstructions(raw: unknown, fallbackAddress?: string | null) {
  const instructions = isRecord(raw) ? raw : {};
  const address = extractPolygonUsdtAddress(instructions, fallbackAddress);
  const transferOptions = normalizeTransferOptions(instructions, address);
  const fiatCurrencies = normalizeArray(instructions.fiatCurrencies ?? instructions.fiat_currencies);

  return {
    ...instructions,
    methods: [POLYGON_USDT_METHOD],
    ...(fiatCurrencies.length > 0 ? { fiatCurrencies } : {}),
    transferOptions,
    polygonUsdt: {
      address,
      asset: "USDT",
      network: "polygon",
      networkLabel: "Polygon (MATIC)",
      tokenContract: process.env.POLYGON_USDT_TOKEN_ADDRESS ?? null,
    },
  };
}
