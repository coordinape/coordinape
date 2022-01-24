// import { PrismaClient } from '@prisma/client';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

async function run() {
  const prisma = new PrismaClient();

  try {
    // TODO: Perhaps refactor into a transaction.
    const tables = {
      feedbacks: prisma.feedbacks,
      gift: prisma.gift,
      pending_token_gifts: prisma.pending_token_gifts,
      teammates: prisma.teammates,
      vouches: prisma.vouches,
      nominees: prisma.nominees,
      user: prisma.user,
      epoch: prisma.epoch,
      circle: prisma.circle,
      protocols: prisma.protocols,
      profile: prisma.profile,
    } as unknown as Record<
      string,
      { deleteMany: (o: Record<string, never>) => Promise<{ count: number }> }
    >;

    const events: string[] = [];
    for (const [name, table] of Object.entries(tables)) {
      const r = await table.deleteMany({});
      if (typeof r.count === 'number') {
        events.push(`Deleted ${r.count} from ${name}`);
      } else {
        throw `Failed to deleteMany.`;
      }
    }

    console.log("Coordinape destroyed, I hope you're happy.", events);
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

(async function () {
  await run()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
})();
