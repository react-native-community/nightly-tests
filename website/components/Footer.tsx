import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import InlineLink from '~/components/InlineLink';

export default function Footer() {
  return (
    <footer className="border-t-border border-t py-12 shadow-xs">
      <div
        className={twMerge(
          'w-full max-w-[1280px] grid grid-cols-4 px-4 mx-auto gap-6',
          'max-md:grid-cols-1 max-md:items-center max-md:text-center'
        )}>
        <div className="flex flex-col gap-2 pt-1.5">
          <Link href="https://opensource.fb.com/" className="w-fit max-md:mx-auto" target="_blank">
            <picture>
              <img src="oss-logo.svg" className="w-[180px] max-md:mx-auto dark:hidden" alt="Meta Open Source Logo" />
              <img
                src="oss-logo-dark.svg"
                className="hidden w-[180px] max-md:mx-auto dark:block"
                alt="Meta Open Source Logo"
              />
            </picture>
          </Link>
          <p className="text-secondary text-xs">Copyright © Meta Platforms, Inc</p>
        </div>
        <div className="flex flex-col gap-2 text-sm max-md:items-center">
          <p className="text-base font-semibold">Participate</p>
          <InlineLink href="https://reactnative.dev/community/overview">Community</InlineLink>
          <InlineLink href="https://reactnative.dev/contributing/overview">Contributing</InlineLink>
          <InlineLink href="https://reactnative.directory">Directory</InlineLink>
        </div>
        <div className="flex flex-col gap-2 text-sm max-md:items-center">
          <p className="text-base font-semibold">Find us</p>
          <InlineLink href="https://reactnative.dev/blog">Blog</InlineLink>
          <InlineLink href="https://github.com/facebook/react-native">GitHub</InlineLink>
          <InlineLink href="https://bsky.app/profile/reactnative.dev">Bluesky</InlineLink>
          <InlineLink href="https://x.com/reactnative">X</InlineLink>
        </div>
        <div className="flex flex-col gap-2 text-sm max-md:items-center">
          <p className="text-base font-semibold">More</p>
          <InlineLink href="https://react.dev">React</InlineLink>
          <InlineLink href="https://reactnative.dev">React Native</InlineLink>
        </div>
      </div>
    </footer>
  );
}
