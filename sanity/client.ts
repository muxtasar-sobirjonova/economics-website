import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-05-01';

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
});

import type { QueryParams, FilteredResponseQueryOptions } from 'next-sanity';

// Override fetch config globally for sanity to utilize next/cache
const originalFetch = client.fetch.bind(client);
client.fetch = async <R = any>(query: string, params: QueryParams = {}, options: any = {}): Promise<R> => {
  return originalFetch(query, params, {
    next: { revalidate: 3600 },
    ...options,
  });
};

if (!projectId) {
  console.warn('[Sanity] No NEXT_PUBLIC_SANITY_PROJECT_ID set — CMS fetches will likely fail.');
}
