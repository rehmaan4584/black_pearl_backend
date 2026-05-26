import * as fs from 'node:fs';
import * as path from 'node:path';
import * as pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const sizes = [
  { name: 'S', displayOrder: 1 },
  { name: 'M', displayOrder: 2 },
  { name: 'L', displayOrder: 3 },
  { name: 'XL', displayOrder: 4 },
  { name: 'XXL', displayOrder: 5 },
];

const colors = [
  { name: 'Black', hexCode: '#000000' },
  { name: 'Blue', hexCode: '#0000FF' },
  { name: 'Dark Blue', hexCode: '#00008B' },
  { name: 'Light Blue', hexCode: '#ADD8E6' },
];

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');

    process.env[key] ??= value;
  }
}

async function main() {
  loadEnvFile();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to seed the database');
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    for (const size of sizes) {
      await prisma.size.upsert({
        where: { name: size.name },
        update: { displayOrder: size.displayOrder },
        create: size,
      });
    }

    for (const color of colors) {
      await prisma.color.upsert({
        where: { name: color.name },
        update: { hexCode: color.hexCode },
        create: color,
      });
    }

    console.log('Seed completed: sizes and colors are ready.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
