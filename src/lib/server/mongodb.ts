import mongoose from "mongoose";

const globalMongo = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!globalMongo.mongooseConnection) {
    globalMongo.mongooseConnection = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME ?? "asset_union",
      bufferCommands: false,
    });
  }
  return globalMongo.mongooseConnection;
}
