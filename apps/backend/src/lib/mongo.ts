import { MongoClient, Db } from 'mongodb';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

const getMongoUri = (): string | null => {
  const uri = process.env.MONGODB_URI?.trim();
  return uri ? uri : null;
};

const getDbNameFromUri = (uri: string): string => {
  // mongodb+srv://.../<dbName>?...
  const withoutQuery = uri.split('?')[0];
  const parts = withoutQuery.split('/');
  const candidate = parts[parts.length - 1];
  return candidate && candidate.length > 0 ? candidate : 'myntra_replica';
};

export const connectMongo = async (): Promise<Db | null> => {
  if (mongoDb) return mongoDb;

  const mongoUri = getMongoUri();
  if (!mongoUri) return null;

  const dbName = getDbNameFromUri(mongoUri);
  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  mongoDb = mongoClient.db(dbName);
  return mongoDb;
};

export const getMongoDb = async (): Promise<Db | null> => {
  if (mongoDb) return mongoDb;
  return connectMongo();
};

export const closeMongo = async (): Promise<void> => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    mongoDb = null;
  }
};
