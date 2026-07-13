export const legalSecurityTimeline = [
  {
    title: "DAO LLC - Wyoming Registration",
    body: "Legally registered entity directly tied to the property",
  },
  {
    title: "Investment Agreement",
    body: "Notarised local agreement between DAO LLC and the seller",
  },
  {
    title: "Smart Contracts",
    body: "Immutable on-chain rules for distributions and ownership",
  },
  {
    title: "Personal Wallet Custody",
    body: "Tokens in your wallet - independent of the platform",
  },
] as const;

export const legalSecurityChecks = [
  "Registered with the Wyoming Secretary of State - publicly verifiable",
  'Smart contract address recorded in the DAO\'s "Public Identifier"',
  "Investor voting rights over key property decisions",
  "U.S. corporate limited-liability protection for all co-owners",
] as const;

export const daoLlcCards = [
  {
    title: "Decentralized Autonomous Organization (DAO)",
    body: "You and a community of co-investors who make key decisions using smart contracts and on-chain voting - without relying on any single centralised authority.",
    icon: "dao",
  },
  {
    title: "Limited Liability Company (LLC)",
    body: "An officially registered company in Wyoming, USA - with limited liability protection, the ability to enter contracts, and recognition under U.S. corporate law.",
    icon: "llc",
  },
] as const;

export const hybridModelChecks = [
  "Real property rights backed by a registered U.S. entity",
  "Investor protection under Wyoming corporate law",
  "Entry from just $50 - fractional ownership",
  "24/7 liquidity via secondary P2P market",
] as const;

export const daoRegistrationSteps = [
  {
    id: "1",
    title: "Select a property on the platform",
    body: "Complete registration and KYC verification to access the full property details and documents tab.",
  },
  {
    id: "2",
    title: "Construction phase",
    body: 'Find the "DAO" tab and follow the link to the registered DAO LLC on the Wyoming Secretary of State\'s official website. Download the registration documents.',
  },
  {
    id: "3",
    title: 'Locate the "Public Identifier"',
    body: 'In the registration documents, find the "Public Identifier" section - this is the on-chain smart contract address that links the legal entity to the blockchain.',
  },
  {
    id: "4",
    title: "Tokens stored in your personal wallet",
    body: 'In the registration documents, find the "Public Identifier" section - this is the on-chain smart contract address that links the legal entity to the blockchain.',
  },
] as const;

export const ownershipStructureRows = [
  ["You (Investor)", "Token Holder - 12 shares"],
  ["Smart Contract (Polygon)", "0x8a3f...c4d1"],
  ["Wyoming DAO LLC", "Sunset Villas DAO LLC"],
  ["Local Company (PT Indonesia)", "Holds legal title to the property"],
] as const;

export const investmentAgreementRows = [
  ["First Party", "PT Bali Sunrise Properties"],
  ["Second Party", "Sunset Villas DAO LLC (Wyoming)"],
  ["Asset", "Villa No. 7 - Seminyak, Bali"],
  ["Value", "$350,000 USD"],
] as const;

export const investmentAgreementSteps = [
  {
    id: "1",
    title: "Select a property and complete KYC",
    body: "The investment agreement is attached once the first phase of financing is collected - for construction - or after the sale agreement is concluded for ready properties.",
  },
  {
    id: "2",
    title: 'Open "Documents" on the property page',
    body: 'Review the signed "Investment Agreement" with the local company, cross-referenced against the local authority\'s business registry.',
  },
  {
    id: "3",
    title: 'Find the DAO LLC in "Second Party"',
    body: 'In the agreement, the "Second Party" section identifies the specific DAO LLC and its authorised representatives - confirming the legal link.',
  },
  {
    id: "4",
    title: "Tokens stored in your personal wallet",
    body: 'In the registration documents, find the "Public Identifier" section - this is the on-chain smart contract address that links the legal entity to the blockchain.',
  },
] as const;

export const smartContractFeatures = [
  {
    title: "Automated Profit Distribution",
    body: "Rental income is distributed to all token holders proportionally - every 24 hours, on-chain. No manual processing.",
    icon: "shield",
  },
  {
    title: "Fixed, Immutable Rules",
    body: "Supply cap, share price, and distribution logic can only be changed by a majority investor vote - not the platform team.",
    icon: "rules",
  },
  {
    title: "Transparent On-Chain Registry",
    body: "Every transaction, ownership transfer, and income distribution is publicly verifiable on the Polygon blockchain explorer.",
    icon: "registry",
  },
  {
    title: "24/7 Liquidity",
    body: "Tokens for fully-sold properties can be traded on the secondary market at any time - no lock-up periods.",
    icon: "liquidity",
  },
] as const;

export const rentDistributionSteps = [
  {
    id: "1",
    title: "Tenant pays monthly rent",
    body: "e.g. $2,050 / month for villa rental",
  },
  {
    id: "2",
    title: "Platform manager replenishes contract",
    body: "Net income (after management fees) is loaded into the smart contract",
  },
  {
    id: "3",
    title: "Smart contract auto-distributes",
    body: "Funds are split proportionally among all token holders in real time",
  },
  {
    id: "4",
    title: "Tokens credited to your wallet",
    body: "Income arrives in your wallet daily - trackable on the Polygon explorer",
  },
  {
    id: "5",
    title: "Verify in the smart contract",
    body: 'Cross-check contract address from the "Documents -> DAO" tab against Wyoming "Public Identifier"',
  },
] as const;

export const walletOwnershipSteps = [
  {
    id: "1",
    title: "Complete KYC - required by Wyoming law",
    body: "Identity verification is mandatory under Wyoming DAO LLC corporate law. Your verified wallet is then recorded in the smart contract registry.",
  },
  {
    id: "2",
    title: "Purchase and receive tokens",
    body: "After buying, tokens appear in your personal wallet - not in a platform account. Use the built-in Magic Link provider or connect MetaMask / Trust Wallet.",
  },
  {
    id: "3",
    title: "Your wallet address is on-chain",
    body: "Your wallet address is stored in the property's DAO LLC smart contract. State agencies can verify your ownership directly from the blockchain registry.",
  },
  {
    id: "4",
    title: "Trade on the secondary market anytime",
    body: "Sell tokens to other verified investors via the P2P market - or transfer them off-platform to any compatible wallet. Full liquidity, 24/7.",
  },
] as const;

export const walletHoldings = [
  {
    title: "Bali Villa No. 7",
    subtitle: "12 tokens - Rental",
    value: "$600",
    apr: "+12%APR",
  },
  {
    title: "Bali Villa No. 7",
    subtitle: "12 tokens - Rental",
    value: "$600",
    apr: "+12%APR",
  },
  {
    title: "Bali Villa No. 7",
    subtitle: "12 tokens - Rental",
    value: "$600",
    apr: "+12%APR",
  },
] as const;

export const daoLlcFaqs = [
  "What is tokenization?",
  "How do co-owners earn passive income?",
  "Why can't I exit a construction project early?",
  "Does Asset Union need a licence to operate?",
  "What if I want a higher return?",
] as const;
