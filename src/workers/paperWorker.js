const { parentPort, workerData } = require('worker_threads');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

(async () => {
  console.log('Worker started with data:', workerData);

  prisma.$disconnect();
})();