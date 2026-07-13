import { AppRecordModel, GovernanceVoteModel, InvestmentModel, NotificationModel, UserModel, WalletTransactionModel } from "@/lib/server/models";
import { Property } from "@/admin/models";

const DEFAULT_PROPERTY_IMAGE = "/images/transparent-placeholder.svg";

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function money(value: unknown, fallback = "$0") {
  const parsed = numberValue(value, Number.NaN);
  if (!Number.isFinite(parsed)) return fallback;
  return `$${parsed.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function percent(value: unknown, fallback = "0%") {
  const parsed = numberValue(value, Number.NaN);
  if (!Number.isFinite(parsed)) return fallback;
  return `${parsed}%`;
}

function titleCase(value: unknown, fallback = "") {
  const input = stringValue(value, fallback);
  return input.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function compactStrings(values: unknown[]): string[] {
  return values.flatMap((value) => {
    if (Array.isArray(value)) return compactStrings(value);
    const text = stringValue(value);
    return text ? [text] : [];
  });
}

function uniqueStrings(values: string[]) {
  return [...new Set(values)];
}

function slugify(value: unknown) {
  return stringValue(value, "property").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "property";
}

function propertyRecordSlug(property: any) {
  const base = slugify(property.slug || property.name);
  const suffix = String(property._id).slice(-6);
  return base.endsWith(suffix) ? base : `${base}-${suffix}`;
}

function sectionsFor(property: any) {
  return property.metadata?.sections || {};
}

function locationFor(property: any, basic: Record<string, unknown>) {
  return stringValue(compactStrings([basic.city, basic.region, basic.country]).join(", "), property.location || "Not specified");
}

function galleryFor(property: any, basic: Record<string, unknown>) {
  const heroImage = stringValue(basic.coverImageUrl, property.heroImage || DEFAULT_PROPERTY_IMAGE);
  return uniqueStrings(compactStrings([heroImage, basic.galleryUrls, property.gallery]));
}

function documentRows(property: any) {
  return (property.documents || []).map((doc: any) => ({
    id: String(doc._id),
    title: stringValue(doc.title, "Document"),
    subtitle: titleCase(doc.type, "Document"),
    externalUrl: stringValue(doc.externalUrl, doc.url || ""),
    action: doc.action === "chevron" ? "chevron" : "open",
  }));
}

function aboutContent(intro: unknown, sections: Array<{ heading?: string; value?: unknown; bullets?: unknown[] }>) {
  return {
    intro: stringValue(intro),
    sections: sections
      .map((section) => ({
        heading: section.heading,
        paragraphs: stringValue(section.value) ? [stringValue(section.value)] : undefined,
        bullets: section.bullets ? compactStrings(section.bullets) : undefined,
      }))
      .filter((section) => section.paragraphs?.length || section.bullets?.length),
  };
}

function kvRows(entries: Array<[string, unknown]>) {
  return entries
    .map(([label, value]) => ({ label, value: typeof value === "number" ? value.toLocaleString("en-US") : stringValue(value) }))
    .filter((row) => row.value);
}

function mapTimeline(stages: any[] | undefined, iconPrefix: "ct" | "pt") {
  const fallback = iconPrefix === "ct"
    ? [{ id: "stage-1", name: "Construction start", description: "Timeline will be updated by the admin team.", status: "current" }]
    : [{ id: "stage-1", name: "Initial funding", description: "Funding timeline will be updated by the admin team.", status: "current" }];
  const iconKeys = iconPrefix === "ct"
    ? ["ct-start", "ct-foundation", "ct-walls", "ct-engineering", "ct-finishing", "ct-landscaping"]
    : ["pt-waitlisting", "pt-initial", "pt-construction-funding", "pt-funded", "pt-strategy-selection", "pt-on-sale"];
  return (stages?.length ? stages : fallback).map((stage, index) => {
    const rawStatus = stringValue(stage.status, "locked");
    const status = rawStatus === "completed" ? "done" : rawStatus === "in-progress" || rawStatus === "current" ? "current" : "locked";
    const date = stringValue(stage.date);
    const dateValue = date ? new Date(date) : null;
    return {
      id: stringValue(stage.id, `stage-${index + 1}`),
      title: stringValue(stage.name, `Stage ${index + 1}`),
      description: stringValue(stage.description, "Details will be updated soon."),
      status,
      dateLabel: dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined,
      dateSubLabel: dateValue && !Number.isNaN(dateValue.getTime()) ? String(dateValue.getFullYear()) : undefined,
      iconKey: iconKeys[index % iconKeys.length],
    };
  });
}

function quickShareOptions(sharePrice: number, minimumShares: number) {
  const first = Math.max(1, minimumShares || 1);
  return [first, first * 5, first * 10, first * 20].map((shares) => ({
    shares,
    usdLabel: money(shares * sharePrice, "$0"),
  }));
}

function rentalRecordData(property: any, existingFeatured: boolean) {
  const sections = sectionsFor(property);
  const basic = sections.basicPropertyInformation || {};
  const investment = sections.investmentStructure || {};
  const economics = sections.rentalEconomics || {};
  const management = sections.propertyManagement || {};
  const legal = sections.legalOwnership || {};
  const description = sections.propertyDescription || {};
  const title = stringValue(basic.propertyName, property.name || "Untitled property");
  const location = locationFor(property, basic);
  const gallery = galleryFor(property, basic);
  const heroImage = gallery[0] || DEFAULT_PROPERTY_IMAGE;
  const sharePriceValue = Math.max(1, numberValue(investment.sharePrice, 50));
  const valuation = numberValue(investment.propertyValuation, property.fundingTarget || 0);
  const target = numberValue(property.fundingTarget, valuation);
  const raised = numberValue(property.fundingRaised, 0);
  const collectedPercent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const apr = percent(economics.expectedApr);
  const manager = stringValue(management.managerCompanyName, property.managerName || "Asset Union");
  const statusLabel = property.status === "active" ? "Open" : titleCase(property.status, "Draft");

  return {
    adminPropertyId: String(property._id),
    slug: propertyRecordSlug(property),
    asset: "USDT",
    isFeatured: existingFeatured,
    featured: existingFeatured,
    featuredMeta: { coOwners: "0", fundsCollected: `${collectedPercent}%`, aprPercent: apr },
    card: {
      imageLayers: [heroImage],
      badge: "funded",
      rightColumn: "apr",
      title,
      location,
      fundsCollected: `${collectedPercent}%`,
      coOwners: "0",
      aprPercent: apr,
      instantIncome: true,
    },
    detail: {
      displayTitle: title,
      heroImage,
      gallery,
      investorsCount: "0 investors",
      statusBadgeLabel: statusLabel,
      propertyPrice: money(valuation || target),
      aprPercent: apr,
      ecaLabel: percent(economics.occupancyRate, "0%"),
      sharePrice: `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`,
      sharePriceValue,
      collectedPercent,
      balanceDisplay: "0 USDT",
      primaryCtaLabel: "Buy Shares",
      quickShareOptions: quickShareOptions(sharePriceValue, numberValue(investment.minimumShares, 1)),
      managerPrompt: "Property Manager",
      managerName: manager,
      managerRole: stringValue(property.managerRole, "Property Manager"),
      managementCompanyName: manager,
      companyTag: titleCase(management.managementType, "Management"),
      documents: documentRows(property),
      descriptionTab: aboutContent(description.overview || basic.shortSummary, [
        { heading: "Rental Demand", value: description.rentalDemandRationale },
        { heading: "Tenant Profile", value: description.tenantProfile },
        { heading: "Location Advantage", value: description.locationAdvantage },
      ]),
      propertyActivitiesTab: [],
      managementTab: {
        rows: kvRows([
          ["Manager", manager],
          ["Management Type", titleCase(management.managementType)],
          ["Operational Notes", management.operationalNotes],
          ["Amenities", compactStrings([management.amenities]).map((item: string) => titleCase(item)).join(", ")],
        ]).map((row) => ({ type: "kv" as const, ...row })),
        card: { companyName: manager, subtitle: "Property management", imageSrc: heroImage },
      },
      financialsTab: {
        rows: kvRows([
          ["Property Valuation", money(valuation)],
          ["Share Price", `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`],
          ["Expected Annual Rental Income", money(economics.expectedAnnualRentalIncome)],
          ["Expected APR", apr],
          ["Distribution Frequency", titleCase(economics.distributionFrequency)],
          ["Rent Start Date", economics.rentStartDate],
        ]),
      },
      landOwnershipTab: {
        rows: kvRows([
          ["Ownership Type", titleCase(legal.ownershipType)],
          ["Legal Right Type", titleCase(legal.legalRightType)],
          ["Legal Owner", legal.ownerFullName],
          ["Formation State", legal.formationState],
          ["Country", legal.ownerCountry],
        ]),
      },
      locationTab: {
        embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`,
        largeMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      },
    },
  };
}

function constructionRecordData(property: any, existingFeatured: boolean) {
  const sections = sectionsFor(property);
  const basic = sections.basicPropertyInformation || {};
  const funding = sections.fundingStructure || {};
  const propertyDetails = sections.propertyDetails || {};
  const constructionTimeline = sections.constructionTimeline || {};
  const projectTimeline = sections.projectTimeline || {};
  const title = stringValue(basic.propertyName, property.name || "Untitled project");
  const location = locationFor(property, basic);
  const gallery = galleryFor(property, basic);
  const heroImage = gallery[0] || DEFAULT_PROPERTY_IMAGE;
  const sharePriceValue = Math.max(1, numberValue(funding.sharePrice, 50));
  const target = numberValue(funding.totalFundingGoal, property.fundingTarget || 0);
  const raised = numberValue(property.fundingRaised, 0);
  const progressPercent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const projectedRoi = target > 0 && propertyDetails.estimatedCompletionValue
    ? percent(((numberValue(propertyDetails.estimatedCompletionValue) - target) / target) * 100)
    : "0%";
  const manager = stringValue(propertyDetails.builderContractor, property.managerName || "Asset Union");
  const timeline = mapTimeline(constructionTimeline.stages, "ct");
  const projectStages = mapTimeline(projectTimeline.stages, "pt");

  return {
    adminPropertyId: String(property._id),
    slug: propertyRecordSlug(property),
    asset: "USDT",
    featured: existingFeatured,
    card: {
      imageLayers: [heroImage],
      badge: "construction",
      rightColumn: "constructionEnd",
      title,
      location,
      fundsCollected: `${progressPercent}%`,
      coOwners: "0",
      constructionEndQuarter: projectStages.at(-1)?.dateSubLabel || "TBD",
    },
    detail: {
      displayTitle: title,
      heroImage,
      gallery,
      investorsLabel: "0 investors",
      statusBadge: property.status === "active" ? "Funding open" : titleCase(property.status, "Draft"),
      totalRaised: money(raised),
      raisedGoal: money(target),
      progressPercent,
      expectedExit: titleCase(propertyDetails.tradingLock, "Funding complete"),
      projectedRoi,
      projectedApr: projectedRoi,
      sharePrice: `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`,
      sharePriceValue,
      balanceDisplay: "0 USDT",
      managerName: manager,
      managerRole: "Builder / Contractor",
      companyName: manager,
      companyTag: titleCase(propertyDetails.permitStatus, "Project"),
      documents: documentRows(property),
      sharePriceTab: {
        initialPrice: `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`,
        currentPrice: `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`,
        endConstructionPrice: money(propertyDetails.estimatedCompletionValue, "TBD"),
      },
      calculatorTab: {
        min: sharePriceValue,
        max: Math.max(sharePriceValue * 100, target || sharePriceValue * 100),
        ticks: [sharePriceValue, sharePriceValue * 25, sharePriceValue * 50, sharePriceValue * 75, sharePriceValue * 100],
        defaultAmount: sharePriceValue * 10,
        youWillHaveMultiplier: sharePriceValue > 0 ? 1 / sharePriceValue : 1,
        breakdown: kvRows([
          ["Share price", `${sharePriceValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT`],
          ["Projected ROI", projectedRoi],
          ["Funding goal", money(target)],
        ]),
      },
      propertyActivitiesTab: [],
      howItWorksTab: aboutContent("Funding milestones are updated by the admin team.", []),
      aboutPropertyTab: aboutContent(basic.shortSummary, [
        { heading: "Project Type", value: titleCase(basic.constructionType || propertyDetails.propertyType) },
        { heading: "Builder", value: propertyDetails.builderContractor },
      ]),
      propertyInfoTab: {
        rows: kvRows([
          ["Property Type", titleCase(propertyDetails.propertyType)],
          ["Ownership Type", titleCase(propertyDetails.ownershipType)],
          ["Permit Status", titleCase(propertyDetails.permitStatus)],
          ["Trading Lock", titleCase(propertyDetails.tradingLock)],
        ]),
        statRows: [
          kvRows([
            ["Bedrooms", propertyDetails.bedrooms],
            ["Bathrooms", propertyDetails.bathrooms],
          ]),
          kvRows([
            ["Built Area", propertyDetails.builtArea],
            ["Land Size", propertyDetails.landSize],
          ]),
        ],
      },
      faqTab: [],
    },
    timeline,
    constructionSiteTimeline: projectStages,
  };
}

export async function syncPropertyToClientRecord(property: any) {
  const resource = property.type === "construction" ? "construction-property" : "rental-property";
  const id = String(property._id);
  const existing = await AppRecordModel.findOne({ resource, "data.adminPropertyId": id }).select("featured sortOrder").lean();
  await AppRecordModel.deleteMany({ resource: { $in: ["rental-property", "construction-property"], $ne: resource }, "data.adminPropertyId": id });
  const featured = Boolean(existing?.featured);
  const data = property.type === "construction" ? constructionRecordData(property, featured) : rentalRecordData(property, featured);
  const slug = data.slug;
  const published = property.status === "active";
  const filter = existing ? { _id: existing._id } : { resource, slug };
  const record = await AppRecordModel.findOneAndUpdate(
    filter,
    {
      $set: {
        resource,
        slug,
        title: data.card.title,
        status: property.status,
        published,
        data,
      },
      $setOnInsert: {
        featured,
        sortOrder: existing?.sortOrder ?? 0,
      },
    },
    { new: true, upsert: true },
  );
  return record;
}

export async function removePropertyClientRecord(property: any) {
  const id = typeof property === "string" ? property : String(property._id);
  await AppRecordModel.deleteMany({ resource: { $in: ["rental-property", "construction-property"] }, "data.adminPropertyId": id });
}

async function proposalProperty(proposal: any) {
  if (proposal.propertyId && typeof proposal.propertyId === "object" && proposal.propertyId.name) return proposal.propertyId;
  if (!proposal.propertyId) return null;
  return Property.findById(proposal.propertyId).select("name slug location").lean();
}

export async function syncGovernanceProposalToClientRecord(proposal: any) {
  const property = await proposalProperty(proposal);
  const title = stringValue(proposal.title, "Governance proposal");
  const closesAt = proposal.closesAt ? new Date(proposal.closesAt) : new Date(Date.now() + 7 * 86400_000);
  const published = ["active", "closed"].includes(String(proposal.status));
  const propertySlug = property ? propertyRecordSlug(property) : null;
  const data = {
    adminProposalId: String(proposal._id),
    breadcrumbLabel: title,
    title,
    propertyLine: stringValue(property?.name),
    propertyShort: stringValue(property?.name),
    propertySlug,
    categoryLabel: titleCase(proposal.category, "General"),
    proposerNote: "Asset Union Admin",
    eligibleVotes: numberValue(proposal.eligibleVotes, 0),
    daysLeft: null,
    locationDetail: stringValue(property?.location),
    description: stringValue(proposal.description),
    proposedBy: "Asset Union Admin",
    dateSubmitted: proposal.createdAt?.toISOString?.() ?? new Date().toISOString(),
    votingCloses: closesAt.toISOString(),
    closesAt: closesAt.toISOString(),
    cost: numberValue(proposal.estimatedCost, 0) > 0 ? money(proposal.estimatedCost) : "No cost entered",
    quorumRequired: `${numberValue(proposal.quorumPercent, 51)}% of eligible votes`,
    castSummary: "0 votes cast",
    quorumMessage: "Quorum has not been reached.",
    userVotingPower: 0,
    voteBlurbs: {
      for: "Approve this proposal",
      against: "Reject this proposal",
      abstain: "Count toward quorum only",
    },
  };
  return AppRecordModel.findOneAndUpdate(
    { resource: "governance-proposal", "data.adminProposalId": String(proposal._id) },
    {
      $set: {
        resource: "governance-proposal",
        slug: proposal.slug,
        title,
        status: proposal.status,
        published,
        data,
      },
      $setOnInsert: { featured: false, sortOrder: 0 },
    },
    { new: true, upsert: true },
  );
}

export async function removeGovernanceProposalClientRecord(proposal: any) {
  const records = await AppRecordModel.find({ resource: "governance-proposal", "data.adminProposalId": String(proposal._id) }).select("_id").lean();
  await AppRecordModel.deleteMany({ resource: "governance-proposal", "data.adminProposalId": String(proposal._id) });
  if (records.length) await GovernanceVoteModel.deleteMany({ proposalId: { $in: records.map((record: any) => record._id) } });
}

export async function deliverClientInAppNotification(notification: any) {
  if (!(notification.channels || []).includes("in_app")) return 0;
  if (!["All", "Investors"].includes(notification.audience)) return 0;
  const users = await UserModel.find({ status: "active" }).select("_id").lean();
  if (!users.length) return 0;
  const result = await NotificationModel.bulkWrite(users.map((user: any) => ({
    updateOne: {
      filter: { userId: user._id, "metadata.adminNotificationId": String(notification._id) },
      update: {
        $setOnInsert: {
          userId: user._id,
          type: notification.type || "manual",
          title: notification.title,
          subtitle: notification.message,
          href: notification.href || undefined,
          metadata: { adminNotificationId: String(notification._id), audience: notification.audience },
        },
      },
      upsert: true,
    },
  })));
  return result.upsertedCount || 0;
}

export async function syncRentDistributionToClientWallets(rent: any) {
  if (rent.status !== "distributed") return { count: 0, total: 0 };
  const propertyId = String(typeof rent.propertyId === "object" ? rent.propertyId._id : rent.propertyId);
  const record = await AppRecordModel.findOne({ resource: "rental-property", "data.adminPropertyId": propertyId, published: true }).lean();
  if (!record) return { count: 0, total: 0 };
  const investments = await InvestmentModel.find({ propertyId: record._id, status: "completed" }).lean();
  const totalShares = investments.reduce((sum: number, item: any) => sum + numberValue(item.shares), 0);
  const netDistributable = numberValue(rent.netDistributable);
  if (!totalShares || !netDistributable) return { count: 0, total: 0 };
  await WalletTransactionModel.bulkWrite(investments.map((investment: any) => {
    const amount = (netDistributable * numberValue(investment.shares)) / totalShares;
    return {
      updateOne: {
        filter: { userId: investment.userId, kind: "rent_accrual", "metadata.adminRentId": String(rent._id) },
        update: {
          $setOnInsert: {
            userId: investment.userId,
            propertyId: record._id,
            kind: "rent_accrual",
            direction: "credit",
            asset: "USDT",
            amount,
            status: "completed",
            description: `Rent distribution for ${record.title}`,
            metadata: { adminRentId: String(rent._id), propertySlug: record.slug },
            completedAt: rent.distributionDate || new Date(),
          },
        },
        upsert: true,
      },
    };
  }));
  return { count: investments.length, total: netDistributable };
}
