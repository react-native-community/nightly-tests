'use client';

import Link from 'next/link';

import { useSearch } from '~/context/SearchContext';

import AndroidIcon from '~/public/icons/android-icon.svg';
import IOSIcon from '~/public/icons/ios-icon.svg';
import data from '~/public/data.json';

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
    ? tableRows.filter(
        row => row.results[latestResultDate]?.[platform] === 'success'
      ).length
    : 0;

  return (
    <div className="flex items-center justify-between">
      <Link href={`#${platform}`} className="w-fit inline-flex rounded-lg pr-2">
        <h3
          id={platform}
          className="text-lg font-semibold inline-flex items-center gap-3 transition-colors scroll-m-20 hover:text-secondary">
          <PlatformIcon className="border border-border size-10 text-secondary bg-subtle p-2 rounded-lg" />
          {isAndroid ? 'Android' : 'iOS'}
        </h3>
      </Link>
      {query.length === 0 && displayMode === 'all' && (
        <span className="text-sm text-secondary tabular-nums">
          {passingCount === tableRows.length
            ? 'All'
            : `${passingCount}/${tableRows.length}`}{' '}
          libraries passing checks
        </span>
      )}
    </div>
  );
}
