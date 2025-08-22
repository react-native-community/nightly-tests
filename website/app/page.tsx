import Link from "next/link";
import Table from "~/components/Table";

import AndroidIcon from "~/public/android-icon.svg";
import IOSIcon from "~/public/ios-icon.svg";

export default function Home() {
  return (
    <main className="max-w-[1280px] w-full mx-auto flex flex-col gap-4 py-8 px-4 overflow-auto">
      <h2 className="mb-2">
        Results of automated GitHub Actions workflows testing React Native
        ecosystem libraries against nightly builds:
      </h2>
      <Link href="#android" className="w-fit inline-flex">
        <h3
          id="android"
          className="text-lg font-semibold inline-flex items-center gap-3 transition-colors scroll-m-20 hover:text-secondary"
        >
          <AndroidIcon className="border border-border size-10 text-secondary bg-subtle p-2 rounded-lg" />
          Android
        </h3>
      </Link>
      <Table platform="android" />
      <Link href="#ios" className="w-fit inline-flex">
        <h3
          id="ios"
          className="text-lg font-semibold inline-flex items-center gap-3 transition-colors scroll-m-20 hover:text-secondary"
        >
          <IOSIcon className="border border-border size-10 text-secondary bg-subtle p-2 rounded-lg" />
          iOS
        </h3>
      </Link>
      <Table platform="ios" />
    </main>
  );
}
