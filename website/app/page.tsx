import DisplayModeSelector from '~/components/DisplayModeSelector';
import PlatformHeading from '~/components/PlatformHeading';
import Table from '~/components/Table';

export default function Home() {
  return (
    <main className="max-w-[1280px] w-full mx-auto flex flex-col gap-4 pt-6 pb-8 px-4 overflow-auto">
      <h2 className="flex justify-between items-center max-lg:flex-col gap-x-2 max-lg:gap-y-3">
        Results of automated GitHub Actions workflows testing React Native
        ecosystem libraries against nightly builds.
        <DisplayModeSelector />
      </h2>
      <PlatformHeading platform="android" />
      <Table platform="android" />
      <PlatformHeading platform="ios" />
      <Table platform="ios" />
    </main>
  );
}
