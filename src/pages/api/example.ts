import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(url.searchParams));
    
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const offset = (page - 1) * limit;

    // Example: Get records from database
    // const [items, total] = await Promise.all([
    //   prisma.exampleModel.findMany({
    //     skip: offset,
    //     take: limit,
    //     orderBy: { createdAt: 'desc' }
    //   }),
    //   prisma.exampleModel.count()
    // ]);

    // For now, return mock data since we don't have a real database connection
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      id: offset + i + 1,
      name: `Example Item ${offset + i + 1}`,
      createdAt: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({
      success: true,
      data: mockItems,
      pagination: {
        page,
        limit,
        total: 100, // Mock total
        pages: Math.ceil(100 / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 