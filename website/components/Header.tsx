"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

import Logo from "~/public/logo.svg";
import GitHubLogo from "~/public/github.svg";
import ThemeLightIcon from "~/public/theme-light.svg";
import ThemeDarkIcon from "~/public/theme-dark.svg";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="border-b border-b-border sticky bg-background/80 backdrop-blur-lg top-0">
      <div className="flex flex-row min-h-[58px] items-center gap-2 max-w-[1280px] w-full mx-auto px-4">
        <Logo className="text-brand size-8" />
        React Native Nightly Tests
        <div className="flex flex-row gap-2 ml-auto">
          <div
            className="cursor-pointer p-1.5 rounded-full hover:bg-hover"
            onClick={() => {
              resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");
            }}
          >
            <ThemeLightIcon className="text-primary size-6 hidden dark:block" />
            <ThemeDarkIcon className="text-primary size-6 dark:hidden" />
          </div>
          <Link
            href="https://github.com/react-native-community/nightly-tests"
            target="_blank"
            className="p-1.5 rounded-full hover:bg-hover"
          >
            <GitHubLogo className="text-primary size-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
