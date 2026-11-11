import DisplayModeSelector from '~/components/DisplayModeSelector';
import PlatformHeading from '~/components/PlatformHeading';
import Table from '~/components/Table';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 overflow-auto px-4 pt-6 pb-8">
      <h2 className="flex items-center justify-between gap-x-2 max-lg:flex-col max-lg:gap-y-3">
        Results of automated GitHub Actions workflows testing React Native ecosystem libraries against nightly builds.
        <DisplayModeSelector />
      </h2>
      <PlatformHeading platform="android" />
      <Table platform="android" />
      <PlatformHeading platform="ios" />
      <Table platform="ios" />
    </main>
  );
}
