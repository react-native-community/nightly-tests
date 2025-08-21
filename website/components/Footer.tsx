import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-t-border shadow-xs">
      <div
        className={twMerge(
          "w-full max-w-[1280px] grid grid-cols-4 px-4 mx-auto",
          "max-md:grid-cols-1 max-md:items-center max-md:gap-y-6 max-md:text-center",
        )}
      >
        <div className="flex flex-col gap-1.5 pt-1.5">
          <Link
            href="https://opensource.fb.com/"
            target="_blank"
            className="pb-0.5"
          >
            <picture>
              <img
                src="oss-logo.svg"
                className="w-[180px] dark:hidden max-md:mx-auto"
                alt="Meta Open Source Logo"
              />
              <img
                src="oss-logo-dark.svg"
                className="w-[180px] hidden dark:block max-md:mx-auto"
                alt="Meta Open Source Logo"
              />
            </picture>
          </Link>
          <p className="text-xs">Copyright © Meta Platforms, Inc</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-base">Participate</p>
          <Link
            href="https://reactnative.dev/community/overview"
            target="_blank"
          >
            Community
          </Link>
          <Link
            href="https://reactnative.dev/contributing/overview"
            target="_blank"
          >
            Contributing
          </Link>
          <Link href="https://reactnative.directory" target="_blank">
            Directory
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-base">Find us</p>
          <Link href="https://reactnative.dev/blog" target="_blank">
            Blog
          </Link>
          <Link href="https://github.com/facebook/react-native" target="_blank">
            GitHub
          </Link>
          <Link href="https://bsky.app/profile/reactnative.dev" target="_blank">
            Bluesky
          </Link>
          <Link href="https://x.com/reactnative" target="_blank">
            X
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-base">More</p>
          <Link href="https://react.dev" target="_blank">
            React
          </Link>
          <Link href="https://reactnative.dev" target="_blank">
            React Native
          </Link>
        </div>
      </div>
    </footer>
  );
}
