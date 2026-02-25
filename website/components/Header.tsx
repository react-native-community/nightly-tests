'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState, useTransition } from 'react';
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
  const [inputValue, setInputValue] = useState(query);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  return (
    <header className="border-b border-b-border sticky bg-background/75 backdrop-blur-lg top-0 z-10">
      <div className="flex flex-row min-h-[58px] items-center gap-6 max-w-[1280px] w-full mx-auto px-4">
        <div className="flex gap-2 items-center">
          <Logo className="text-brand size-8" />
          <p className="whitespace-nowrap max-sm:hidden">
            React Native Nightly Tests
          </p>
          <p className="whitespace-nowrap hidden max-sm:block">RNNT</p>
        </div>
        <div className="relative w-full">
          <SearchIcon className="absolute left-3.5 top-2.75 size-4 text-secondary/60 pointer-events-none" />
          <input
            type="text"
            id="search"
            autoComplete="off"
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
              startTransition(() => setQuery(event.target.value));
            }}
            className={twMerge(
              'w-full bg-subtle border border-border rounded-3xl pl-10 pr-3 py-1.5',
              'placeholder:text-secondary/60'
            )}
            placeholder="Search…"
          />
          {inputValue.length > 0 && (
            <div
              onClick={() => {
                setInputValue('');
                startTransition(() => setQuery(''));
              }}
              className="absolute right-1.5 top-1.25 cursor-pointer p-1.5 rounded-full hover:bg-hover">
              <PlusIcon className="text-secondary size-4 rotate-45" />
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <Tooltip
            content="Add package to the program"
            side="bottom"
            sideOffset={4}>
            <Link
              href="https://github.com/react-native-community/discussions-and-proposals/discussions/931#discussion-8827727"
              target="_blank"
              aria-label="Add package to the program"
              className="p-1.5 rounded-full hover:bg-hover">
              <PlusIcon className="text-secondary size-6" />
            </Link>
          </Tooltip>
          <Tooltip content="Toggle theme" side="bottom" sideOffset={4}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Toggle theme"
              className="cursor-pointer p-1.5 rounded-full hover:bg-hover"
              onClick={() => {
                resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark');
              }}>
              <ThemeLightIcon className="text-secondary size-6 hidden dark:block" />
              <ThemeDarkIcon className="text-secondary size-6 dark:hidden" />
            </div>
          </Tooltip>
          <Tooltip content="GitHub" side="bottom" sideOffset={4}>
            <Link
              href="https://github.com/react-native-community/nightly-tests"
              target="_blank"
              aria-label="Visit GitHub repository"
              className="p-1.5 rounded-full hover:bg-hover">
              <GitHubLogo className="text-secondary size-6" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
