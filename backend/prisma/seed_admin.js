const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('[SeedAdmin] Seeding default admin user...');

  const username = 'admin';
  const email = 'admin@anipulse.com';
  const plainPassword = 'admin123';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      email,
      password: hashedPassword,
      name: 'AniPulse Administrator',
    },
  });

  console.log(`[SeedAdmin] Default admin ready: Username: "${admin.username}", Email: "${admin.email}"`);
}

seedAdmin()
  .catch((e) => {
    console.error('[SeedAdmin] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
