import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { z } from 'zod';
export { renderers } from '../../renderers.mjs';

dotenv.config();
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const QuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10")
});
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(url.searchParams));
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const offset = (page - 1) * limit;
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      id: offset + i + 1,
      name: `Example Item ${offset + i + 1}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }));
    return new Response(JSON.stringify({
      success: true,
      data: mockItems,
      pagination: {
        page,
        limit,
        total: 100,
        // Mock total
        pages: Math.ceil(100 / limit)
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
