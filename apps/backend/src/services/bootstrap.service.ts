import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const bootstrapService = {
  async ensureAdminAccount(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    const adminName = process.env.ADMIN_NAME?.trim() || 'System Admin';

    if (!adminEmail || !adminPassword) {
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    const hashedPassword = await bcrypt.hash(adminPassword, parseInt(process.env.BCRYPT_ROUNDS || '12', 10));

    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
        },
      });
      console.log(`Bootstrap admin created: ${adminEmail}`);
      return;
    }

    if (existing.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: 'ADMIN' },
      });
      console.log(`Bootstrap admin role updated: ${adminEmail}`);
    }
  },
};
