import {PrismaClient} from '@prisma/client'
import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'
import {dev} from '$app/environment'
import {DATABASE_URL} from '$env/static/private'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({url: DATABASE_URL}),
  })

if (dev) globalForPrisma.prisma = prisma
