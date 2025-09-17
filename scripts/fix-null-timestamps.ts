import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixNullTimestamps() {
    try {
        console.log('Fixing null timestamps in database...');

        // Fix null timestamps in users table using raw SQL
        const userUpdateResult = await prisma.$executeRaw`
      UPDATE "User" 
      SET 
        "createdAt" = COALESCE("createdAt", NOW()),
        "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL
    `;

        console.log(`Updated ${userUpdateResult} users with null timestamps`);

        // Fix null timestamps in institutes table using raw SQL
        const instituteUpdateResult = await prisma.$executeRaw`
      UPDATE "Institute" 
      SET 
        "createdAt" = COALESCE("createdAt", NOW()),
        "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL
    `;

        console.log(`Updated ${instituteUpdateResult} institutes with null timestamps`);

        console.log('✅ All null timestamps have been fixed!');

    } catch (error) {
        console.error('❌ Error fixing null timestamps:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixNullTimestamps();
