import { getMongoDb } from '../lib/mongo';

interface MirrorUserPayload {
  userId: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  source: 'register' | 'login' | 'profile';
}

export const mongoAuthMirrorService = {
  async mirrorUser(payload: MirrorUserPayload): Promise<void> {
    try {
      const db = await getMongoDb();
      if (!db) return;

      const users = db.collection('users');
      const authEvents = db.collection('auth_events');
      const now = new Date();

      await users.updateOne(
        { userId: payload.userId },
        {
          $set: {
            email: payload.email,
            name: payload.name,
            phone: payload.phone ?? null,
            role: payload.role,
            updatedAt: now,
          },
          $setOnInsert: {
            userId: payload.userId,
            createdAt: now,
          },
        },
        { upsert: true }
      );

      await authEvents.insertOne({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: payload.source,
        at: now,
      });
    } catch (error) {
      console.error('Mongo mirror failed:', error instanceof Error ? error.message : error);
    }
  },
};
