import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('superadmin123', 12);
    
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@clinicaltrials.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        status: 1,
      },
    });

    console.log('Super admin created successfully:');
    console.log('Email:', superAdmin.email);
    console.log('Password: superadmin123');
    console.log('Role:', superAdmin.role);
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
