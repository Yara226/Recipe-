import React from 'react';
import DetailedCategry from '../components/DetailedCategry/DetailedCategry';

type SearchParams = Promise<{ title?: string }> | { title?: string } | undefined;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await Promise.resolve(searchParams ?? {});
  const mySearch = resolvedParams.title ?? '';

  return <DetailedCategry cateogry={mySearch} />;
}
