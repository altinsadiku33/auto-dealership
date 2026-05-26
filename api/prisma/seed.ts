import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  await prisma.user.upsert({
    where: { email: 'admin@auto.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@auto.com',
      password: await bcrypt.hash('Auto@Admin2025', 12),
      role: 'admin',
    },
  });

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
