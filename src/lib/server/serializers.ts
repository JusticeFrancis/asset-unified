export function serializeRecord(record: any) {
  const data = record?.data?.toObject ? record.data.toObject() : (record?.data ?? {});
  return {
    id: String(record._id),
    resource: record.resource,
    slug: record.slug,
    title: record.title,
    status: record.status,
    published: Boolean(record.published),
    featured: Boolean(record.featured),
    sortOrder: Number(record.sortOrder || 0),
    ...data,
    createdAt: record.createdAt?.toISOString?.() ?? record.createdAt,
    updatedAt: record.updatedAt?.toISOString?.() ?? record.updatedAt,
  };
}

export function serializeTransaction(tx: any) {
  return {
    id: String(tx._id),
    kind: tx.kind,
    direction: tx.direction,
    asset: tx.asset,
    amount: tx.amount,
    status: tx.status,
    description: tx.description ?? "",
    providerId: tx.providerId ?? null,
    metadata: tx.metadata ?? {},
    createdAt: tx.createdAt?.toISOString?.() ?? tx.createdAt,
    completedAt: tx.completedAt?.toISOString?.() ?? tx.completedAt ?? null,
  };
}
