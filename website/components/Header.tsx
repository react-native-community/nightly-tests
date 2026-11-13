'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';

import { useSearch } from '~/context/SearchContext';
import GitHubLogo from '~/public/icons/github-icon.svg';
import PlusIcon from '~/public/icons/plus-icon.svg';
import SearchIcon from '~/public/icons/search-icon.svg';
import ThemeDarkIcon from '~/public/icons/theme-dark-icon.svg';
import ThemeLightIcon from '~/public/icons/theme-light-icon.svg';
import Logo from '~/public/logo.svg';

import Tooltip from './Tooltip';

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { query, setQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query]);

  function clearSearch() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    startTransition(() => setQuery(''));
  }

  return (
    <header className="border-b-border bg-background/75 sticky top-0 z-10 border-b backdrop-blur-lg">
      <div className="mx-auto flex min-h-[58px] w-full max-w-[1280px] flex-row flex-wrap items-center gap-6 px-4 max-sm:gap-x-4 max-sm:gap-y-2 max-sm:pt-1.5 max-sm:pb-2.5">
        <div className="flex items-center gap-2 max-sm:order-1">
          <Logo className="text-brand size-8" />
          <p className="font-normal whitespace-nowrap max-sm:hidden">React Native Nightly Tests</p>
          <p className="hidden whitespace-nowrap max-sm:block">RNNT</p>
        </div>
        <div className="group relative min-w-0 flex-1 max-sm:order-3 max-sm:basis-full">
          <SearchIcon className="text-secondary/60 pointer-events-none absolute top-2.75 left-3.5 size-4" />
          <input
            ref={inputRef}
            type="text"
            id="search"
            autoComplete="off"
            defaultValue={query}
            onChange={event => {
              startTransition(() => setQuery(event.target.value));
            }}
            onKeyDown={event => {
              if (event.key !== 'Escape' || event.currentTarget.value.length === 0) {
                return;
              }

              clearSearch();
            }}
            className={twMerge(
              'w-full bg-subtle border border-border rounded-3xl pl-10 pr-3 py-1.5',
              'placeholder:text-secondary/60'
            )}
            placeholder="Search…"
          />
          <button
            type="button"
            aria-label="Clear search value"
            onClick={clearSearch}
            className="hover:bg-hover absolute top-1.25 right-1.5 hidden cursor-pointer rounded-full p-1.5 group-has-[input:not(:placeholder-shown)]:block">
            <PlusIcon className="text-secondary size-4 rotate-45" />
          </button>
        </div>
        <div className="ml-auto flex flex-row gap-2 max-sm:order-2">
          <Tooltip content="Add package to the program" side="bottom" sideOffset={4}>
            <Link
              href="https://github.com/react-native-community/discussions-and-proposals/discussions/931#discussion-8827727"
              target="_blank"
              aria-label="Add package to the program"
              className="hover:bg-hover rounded-full p-1.5">
              <PlusIcon className="text-secondary size-6" />
            </Link>
          </Tooltip>
          <Tooltip content="Toggle theme" side="bottom" sideOffset={4}>
            <button
              type="button"
              tabIndex={0}
              aria-label="Toggle theme"
              className="hover:bg-hover cursor-pointer rounded-full p-1.5"
              onClick={() => {
                if (resolvedTheme === 'dark') {
                  setTheme('light');
                } else {
                  setTheme('dark');
                }
              }}>
              <ThemeLightIcon className="text-secondary hidden size-6 dark:block" />
              <ThemeDarkIcon className="text-secondary size-6 dark:hidden" />
            </button>
          </Tooltip>
          <Tooltip content="GitHub" side="bottom" sideOffset={4}>
            <Link
              href="https://github.com/react-native-community/nightly-tests"
              target="_blank"
              aria-label="Visit GitHub repository"
              className="hover:bg-hover rounded-full p-1.5">
              <GitHubLogo className="text-secondary size-6" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
