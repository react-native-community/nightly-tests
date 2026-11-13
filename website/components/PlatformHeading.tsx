'use client';

import Link from 'next/link';

import { useSearch } from '~/context/SearchContext';
import data from '~/public/data.json';
import AndroidIcon from '~/public/icons/android-icon.svg';
import IOSIcon from '~/public/icons/ios-icon.svg';
import { type LibraryType } from '~/types/data-types';

type Props = {
  platform: 'android' | 'ios';
};

const tableRows = data as LibraryType[];
const latestResultDate = tableRows
  .flatMap(row => Object.keys(row.results))
  .sort()
  .at(-1);

export default function PlatformHeading({ platform }: Props) {
  const { query, displayMode } = useSearch();

  const isAndroid = platform === 'android';
  const PlatformIcon = isAndroid ? AndroidIcon : IOSIcon;

  const passingCount = latestResultDate
    ? tableRows.filter(row => row.results[latestResultDate]?.[platform] === 'success').length
    : 0;

  return (
    <div className="flex items-center justify-between">
      <Link href={`#${platform}`} className="inline-flex w-fit rounded-lg pr-2">
        <h3
          id={platform}
          className="hover:text-secondary inline-flex scroll-m-20 items-center gap-3 text-lg font-semibold transition-colors">
          <PlatformIcon className="border-border text-secondary bg-subtle size-10 rounded-lg border p-2" />
          {isAndroid ? 'Android' : 'iOS'}
        </h3>
      </Link>
      {query.length === 0 && displayMode === 'all' && (
        <span className="text-secondary text-sm tabular-nums">
          {passingCount === tableRows.length ? 'All' : `${passingCount}/${tableRows.length}`} libraries passing checks
        </span>
      )}
    </div>
  );
}
