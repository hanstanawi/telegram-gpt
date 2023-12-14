import { PrismaClient } from '@prisma/client';

import { VOICE_OPTIONS } from '../common/constants/voice.constants';
const prisma = new PrismaClient();

async function main() {
  const predefinedVoices = Object.values(VOICE_OPTIONS).map((voice) => {
    return { name: voice };
  });

  const voices = await prisma.voice.createMany({
    data: predefinedVoices,
  });

  console.log({ voices });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
