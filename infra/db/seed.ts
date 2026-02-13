import { PrismaClient, Role, Sex, Size, DogStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (in correct order due to foreign keys)
  await prisma.dog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shelter.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create shelter
  const shelter = await prisma.shelter.create({
    data: {
      name: 'Rifugio Amici a Quattro Zampe',
      addressLine: 'Via della Speranza 42',
      city: 'Bologna',
      region: 'Emilia-Romagna',
      country: 'IT',
      phone: '+39 051 123456',
    },
  });

  console.log('✅ Created shelter:', shelter.name);

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@secondleash.com',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      fullName: 'Super Administrator',
      role: Role.SUPER_ADMIN,
      shelterId: null,
      isActive: true,
    },
  });

  const shelterAdmin = await prisma.user.create({
    data: {
      email: 'shelter@secondleash.com',
      passwordHash: await bcrypt.hash('Shelter123!', 12),
      fullName: 'Mario Rossi',
      role: Role.SHELTER_ADMIN,
      shelterId: shelter.id,
      isActive: true,
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@secondleash.com',
      passwordHash: await bcrypt.hash('Staff123!', 12),
      fullName: 'Laura Bianchi',
      role: Role.STAFF,
      shelterId: shelter.id,
      isActive: true,
    },
  });

  const volunteer = await prisma.user.create({
    data: {
      email: 'volunteer@secondleash.com',
      passwordHash: await bcrypt.hash('Volunteer123!', 12),
      fullName: 'Giovanni Verdi',
      role: Role.VOLUNTEER,
      shelterId: shelter.id,
      isActive: true,
    },
  });

  console.log('👥 Created users:');
  console.log(`  - ${superAdmin.email} (${superAdmin.role})`);
  console.log(`  - ${shelterAdmin.email} (${shelterAdmin.role})`);
  console.log(`  - ${staff.email} (${staff.role})`);
  console.log(`  - ${volunteer.email} (${volunteer.role})`);

  // Create dogs
  const dogs = await Promise.all([
    prisma.dog.create({
      data: {
        shelterId: shelter.id,
        name: 'Luna',
        sex: Sex.FEMALE,
        approxBirthdate: new Date('2020-03-15'),
        breed: 'Labrador Retriever',
        size: Size.LARGE,
        weightKg: 28.5,
        microchipId: '380260123456789',
        intakeDate: new Date('2023-06-10'),
        status: DogStatus.AVAILABLE,
        description:
          'Luna è una cagnolina dolce e affettuosa, perfetta per famiglie con bambini. Adora giocare e fare lunghe passeggiate.',
      },
    }),
    prisma.dog.create({
      data: {
        shelterId: shelter.id,
        name: 'Max',
        sex: Sex.MALE,
        approxBirthdate: new Date('2019-08-22'),
        breed: 'Pastore Tedesco',
        size: Size.LARGE,
        weightKg: 35.2,
        microchipId: '380260987654321',
        intakeDate: new Date('2023-01-15'),
        status: DogStatus.FOSTERED,
        description:
          'Max è un cane intelligente e obbediente, ottimo come cane da guardia. Richiede un padrone esperto.',
      },
    }),
    prisma.dog.create({
      data: {
        shelterId: shelter.id,
        name: 'Bella',
        sex: Sex.FEMALE,
        approxBirthdate: new Date('2021-11-05'),
        breed: 'Meticcio',
        size: Size.MEDIUM,
        weightKg: 18.0,
        microchipId: '380260555444333',
        intakeDate: new Date('2023-09-20'),
        status: DogStatus.AVAILABLE,
        description: 'Bella è una cagnolina vivace e giocosa. Va d\'accordo con altri cani.',
      },
    }),
    prisma.dog.create({
      data: {
        shelterId: shelter.id,
        name: 'Rocky',
        sex: Sex.MALE,
        approxBirthdate: new Date('2018-05-12'),
        breed: 'Rottweiler',
        size: Size.XL,
        weightKg: 45.8,
        intakeDate: new Date('2022-11-30'),
        status: DogStatus.MEDICAL,
        description:
          'Rocky è in trattamento medico per un problema alle zampe. Cane molto tranquillo e affettuoso.',
      },
    }),
    prisma.dog.create({
      data: {
        shelterId: shelter.id,
        name: 'Charlie',
        sex: Sex.MALE,
        approxBirthdate: new Date('2022-02-28'),
        breed: 'Beagle',
        size: Size.SMALL,
        weightKg: 12.5,
        microchipId: '380260111222333',
        intakeDate: new Date('2024-01-10'),
        status: DogStatus.ON_HOLD,
        description:
          'Charlie è un cucciolo energico e curioso. Perfetto per chi ama i cani di piccola taglia.',
      },
    }),
  ]);

  console.log(`🐕 Created ${dogs.length} dogs:`, dogs.map((d) => d.name).join(', '));

  console.log('✨ Seed completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('  Super Admin: admin@secondleash.com / Admin123!');
  console.log('  Shelter Admin: shelter@secondleash.com / Shelter123!');
  console.log('  Staff: staff@secondleash.com / Staff123!');
  console.log('  Volunteer: volunteer@secondleash.com / Volunteer123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
